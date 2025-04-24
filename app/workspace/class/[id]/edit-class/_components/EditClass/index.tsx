"use client";
import classRequest from "@/apiRequest/class";
import Schedules from "@/app/workspace/class/[id]/edit-class/_components/Schedules";
import EvaluationTabs from "@/app/workspace/class/config/_components/EvaluationTabs";
import BackTitle from "@/components/BackTitle";
import RemoveClassModal from "@/components/RemoveClassModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useGetTeachers from "@/queryHooks/class/useGetTeachers";
import {
  FeatureType,
  IFeature,
  ScheduleType,
  ScheduleTypes,
  TeachersType,
  TeacherType,
} from "@/types";
import { convertImageUrl, formatTimeApi } from "@/utils";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type InputProps = {
  label: string;
  defaultValue?: string;
  content?: string;
  placeholder?: string;
};

const InputItem = forwardRef<HTMLInputElement, InputProps>(
  ({ label, defaultValue = "", content, placeholder }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <label dangerouslySetInnerHTML={{ __html: label }} />
        <Input
          className="text-[22px] font-semibold py-6 placeholder:text-[16px] placeholder:text-[#B5B7C0] placeholder:font-normal"
          type="text"
          defaultValue={defaultValue}
          ref={ref}
          placeholder={placeholder}
        />
        {content && <p>{content}</p>}
      </div>
    );
  }
);

InputItem.displayName = "InputItem";

type TeacherItemType = TeacherType & {
  onRemove?: () => void;
  onSelect?: () => void;
};

const TeacherItem = ({
  uid,
  avatar,
  name,
  onRemove,
  onSelect = () => {},
}: TeacherItemType) => {
  return (
    <div
      className="flex items-center justify-between gap-2 py-2 [&:not(:last-child)]:border-b cursor-pointer"
      key={uid}
      onClick={onSelect}
    >
      <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center overflow-hidden">
        <Image
          src={convertImageUrl(avatar?.url)}
          width={48}
          height={48}
          alt=""
        />
      </div>
      <p className="flex-1 font-bold">{name}</p>
      {!!onRemove && (
        <button onClick={onRemove}>
          <img src="/images/remove.svg" alt="remove" />
        </button>
      )}
    </div>
  );
};

export default function EditClass({ data }: any) {
  const tCommon = useTranslations("common");
  const tToast = useTranslations("toastmessage");
  const t = useTranslations("class");
  const { toast } = useToast();
  const router = useRouter();
  const [extraEvaluations, setExtraEvaluations] = useState(
    data?.evaluations.filter(
      (item: IFeature) => item.type === FeatureType.EXTRA
    )
  );
  const [minusEvaluations, setMinusEvaluations] = useState(
    data?.evaluations.filter(
      (item: IFeature) => item.type === FeatureType.MINUS
    )
  );
  const [schedules, setSchedules] = useState<ScheduleTypes>(
    data?.schedules ?? []
  );
  const [teachers, setTeachers] = useState<TeachersType>(
    data?.assistantTeachers
  );
  const [publicDailyRecords, setPublicDailyRecords] = useState(
    data?.publicDailyRecords
  );

  const handleUpdateSchedule = (item: ScheduleType) => {
    const newSchedules = schedules.map((x: ScheduleType) => {
      if (x.day === item.day) {
        return {
          ...x,
          startTime: item.startTime,
          endTime: item.endTime,
        };
      } else {
        return x;
      }
    });
    setSchedules(newSchedules);
  };

  const handleRemoveSchedule = (item: ScheduleType) => {
    const newSchedules = schedules.filter(
      (x: ScheduleType) => x.day !== item.day
    );
    setSchedules(newSchedules);
  };

  const handleChangeSchedules = (
    item: ScheduleType,
    type: "add" | "update" | "remove"
  ) => {
    if (type === "update") {
      handleUpdateSchedule(item);
    } else if (type === "add") {
      setSchedules([...schedules, item]);
    } else handleRemoveSchedule(item);
  };

  const handleChangeTeacher = (tea: TeachersType) => {
    setTeachers(tea);
  };

  const nameRef = useRef<HTMLInputElement>(null);
  const fullNameRef = useRef<HTMLInputElement>(null);

  const handleSaveInfo = async () => {
    try {
      const evaluations = [...extraEvaluations, ...minusEvaluations];
      const evaluationsParams = evaluations.map((item) => {
        return {
          ...item,
          image: item.image?.id,
        };
      });
      const params = {
        name: nameRef?.current?.value,
        fullName: fullNameRef?.current?.value,
        evaluations: evaluationsParams,
        publicDailyRecords,
        assistantTeacherUids: teachers?.map((x: any) => x?.uid) || [],
        schedules: schedules.map((x) => ({
          ...x,
          startTime: formatTimeApi(x.startTime),
          endTime: formatTimeApi(x.endTime),
        })),
      };
      if (data?.id) {
        const res = await classRequest.updateClass({
          id: data?.id,
          data: {
            data: params,
          },
        });
        if (res.status === 200) {
          toast({
            title: tCommon("saveInformation"),
            description: tToast("success"),
          });
          router.refresh();
        } else {
          toast({
            variant: "destructive",
            title: tToast("error"),
            description: tToast("desErrorSaveInfo"),
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: tToast("error"),
        description: tToast("desErrorSaveInfo"),
      });
    }
  };

  const handleRemove = async () => {
    try {
      const res = await classRequest.deleteClass(data?.id);
      if (res.status === 200) {
        toast({
          title: tCommon("titleDeleteClass"),
          description: tToast("success"),
        });
        router.push("/workspace/class");
      } else {
        toast({
          variant: "destructive",
          title: tToast("error"),
          description: tToast("desErrorDeleteClass"),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: tToast("error"),
        description: tToast("desErrorDeleteClass"),
      });
    }
  };

  return (
    <div className="pb-10">
      <div className="space-y-6">
        <div>
          <div className="flex gap-4 items-center my-3">
            <BackTitle>
              <h1 className="capitalize text-[32px] font-bold">
                {tCommon("classShort")}: <span>{data?.name}</span>
              </h1>
            </BackTitle>
            <Link
              className="bg-primary text-white rounded-full py-2 p-4 font-semibold"
              href={`/workspace/class/${data?.id}`}
            >
              {tCommon("joinClass")}
            </Link>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <InputItem
              label={`${t(
                "className"
              )}<span class="text-[#F4673D] mb-1 text-sm"> * (Tên ngắn gọn)</span>`}
              defaultValue={data?.name}
              ref={nameRef}
              placeholder={t("className")}
            />
          </div>
          <div className="space-y-6">
            <InputItem
              label={`${t(
                "fullClassName"
              )} <span class="text-[#F4673D] mb-1 text-sm">* (Tên đầy đủ)</span>`}
              defaultValue={data?.fullName}
              ref={fullNameRef}
              placeholder={t("fullClassName")}
            />
          </div>
        </div>
        <Schedules list={schedules} onChange={handleChangeSchedules} />
        <div className="flex gap-6 mt-10">
          <Button
            className="rounded-full p-6 px-10 min-w-[180px] font-semibold"
            onClick={handleSaveInfo}
          >
            {tCommon("saveInformation")}
          </Button>
          <RemoveClassModal onRemove={handleRemove} className="px-10" />
        </div>
      </div>
    </div>
  );
}
