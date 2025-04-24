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

const AssistantTeachers = ({
  teachers,
  onChange = () => {},
}: {
  teachers: TeachersType;
  onChange?: (teachers: TeachersType) => void;
}) => {
  const t = useTranslations("class");
  const tToast = useTranslations("toastmessage");
  const { toast } = useToast();
  const mutation = useGetTeachers();
  const handleSearch = async () => {
    if (mutation.isPending) return;
    const value = refInputSearch.current?.value || "";
    const searchTeachers = await mutation.mutateAsync(value);
    const teachersSet = new Set(teachers?.map((item) => item.uid));
    const searchTeachersFilter = searchTeachers.find(
      (x: TeacherType) => !teachersSet.has(x.uid)
    );
    if (searchTeachers.length > 0) {
      if (searchTeachersFilter) {
        handleSelectTeacher(searchTeachersFilter);
      } else {
        toast({
          variant: "destructive",
          title: tToast("teacherSelected"),
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: tToast("notFindTeacher"),
        description: tToast("pleaseCheckCode"),
      });
    }
  };
  const handleRemove = (uid: string) => {
    const newTeachers = teachers?.filter((x) => x.uid !== uid);
    onChange(newTeachers);
  };
  const refInputModal = useRef<HTMLDivElement>(null);
  const refInputSearch = useRef<HTMLInputElement>(null);
  const handleSelectTeacher = (teacher: TeacherType) => {
    if (teachers && teachers?.length < 5) {
      const newTeachers = teachers ? [...teachers, teacher] : [teacher];
      onChange(newTeachers);
    } else {
      toast({
        variant: "destructive",
        title: tToast("only5Teacher"),
      });
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <label>
        {t("coTeacher")}
        <span className="text-quaternary text-sm"> {t("maxFiveTeacher")}</span>
      </label>
      <div className="border rounded-md p-3 sm:min-h-[430px]">
        <div className="relative" ref={refInputModal}>
          <div>
            <Input
              className="text-[22px] font-semibold py-6 placeholder:text-[16px] placeholder:text-[#B5B7C0] placeholder:font-normal"
              type="text"
              placeholder={t("coTeacherCode")}
              ref={refInputSearch}
            />
            {mutation.isPending ? (
              <FontAwesomeIcon
                className="absolute right-3 top-1/2 -translate-y-1/2"
                icon={faSpinner}
              />
            ) : (
              <img
                onClick={handleSearch}
                src="/images/add.svg"
                alt="add"
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2"
              />
            )}
          </div>
        </div>
        <div className="mt-3">
          {!!teachers?.length ? (
            teachers?.map((item: TeacherType) => (
              <TeacherItem
                key={uuidv4()}
                {...item}
                onRemove={() => {
                  if (item.uid) handleRemove(item.uid);
                }}
              />
            ))
          ) : (
            <div className="flex items-center justify-center flex-col py-20 pb-[152px] gap-3">
              <Image
                src="/images/empty-data.svg"
                width={100}
                height={100}
                alt=""
              />
              <p>{t("noCoTeacher")}</p>
            </div>
          )}
        </div>
      </div>
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
      <div className="p-5 border-2 border-primary rounded-[20px] space-y-8">
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
              )}<span class="text-[#F4673D] mb-1 text-sm"> * ${t(
                "shortNameExample"
              )}</span>`}
              defaultValue={data?.name}
              ref={nameRef}
              placeholder={t("className")}
            />
            <AssistantTeachers
              teachers={teachers}
              onChange={handleChangeTeacher}
            />
            {/* <div className="flex flex-col gap-2">
              <label className="">Xem Điểm và Nhận xét</label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="publicDailyRecords"
                  checked={publicDailyRecords}
                  onCheckedChange={() =>
                    setPublicDailyRecords(!publicDailyRecords)
                  }
                />
                <label
                  htmlFor="publicDailyRecords"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Cho phép xem Điểm và Nhận xét mà không cần MÃ
                </label>
              </div>
            </div> */}
          </div>
          <div className="space-y-6">
            <InputItem
              label={`${t(
                "fullClassName"
              )} <span class="text-[#F4673D] mb-1 text-sm">${t(
                "shortFullNameExample"
              )}</span>`}
              defaultValue={data?.fullName}
              ref={fullNameRef}
              placeholder={t("fullClassName")}
            />
            <Schedules list={schedules} onChange={handleChangeSchedules} />
          </div>
        </div>
        <EvaluationTabs
          minusEvaluations={minusEvaluations}
          extraEvaluations={extraEvaluations}
          onChangeMinus={setMinusEvaluations}
          onChangeExtra={setExtraEvaluations}
        />
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
