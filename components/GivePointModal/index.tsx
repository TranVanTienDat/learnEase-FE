"use client";
import GivePointEvaluations from "@/components/GivePointModal/GivePointEvaluations";
import SearchInput from "@/components/GivePointModal/SearchInput";
import { SelectDropDown } from "@/components/GivePointModal/SelectDropdown";
import Students from "@/components/GivePointModal/Students";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import useActiveStudents from "@/hooks/givePoints/useActiveStudents";
import useStudents from "@/hooks/givePoints/useStudents";
import useGetClasses from "@/queryHooks/class/useGetClasses";
import useGetStudentGivePoint from "@/queryHooks/class/useGetStudentGivePoint";
import useGivePointStudent from "@/queryHooks/class/useGivePointStudent";
import useGivePointStore from "@/stores/give-point";
import {
  EvaluationsActiveGivePointType,
  EvaluationsActiveType,
} from "@/types/giveModal";
import { checkArrayContainsAllIds } from "@/utils";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useEvaluationsActiveGivePoint = () => {
  const [evaluations, setEvaluations] = useState<EvaluationsActiveType>({
    extras: [],
    minus: [],
  });

  const handleReset = () => {
    setEvaluations({
      extras: [],
      minus: [],
    });
  };

  const toggleEvaluation = (
    evaluation: EvaluationsActiveGivePointType,
    type: "extras" | "minus"
  ) => {
    const targetList = evaluations[type];
    const isAlreadySelected = targetList.some(
      (item) => item.id === evaluation.id
    );

    setEvaluations({
      ...evaluations,
      [type]: isAlreadySelected
        ? targetList.filter((item) => item.id !== evaluation.id)
        : [...targetList, evaluation],
    });
  };

  return {
    evaluations,
    onChange: toggleEvaluation,
    onReset: handleReset,
  };
};

const useGivePointSuddenly = () => {
  const [pointSuddenly, setPointSuddenly] = useState({
    extras: 0,
    minus: 0,
  });
  const onChange = (type: "extras" | "minus", value: number) => {
    setPointSuddenly({ ...pointSuddenly, [type]: value });
  };
  const handleReset = () => {
    setPointSuddenly({
      extras: 0,
      minus: 0,
    });
  };
  return {
    pointSuddenly,
    onChange,
    onReset: handleReset,
  };
};

export default function GivePointModal({
  defaultClassId,
}: {
  defaultClassId: string;
}) {
  const t = useTranslations("common");
  const tGivePoint = useTranslations("givePoint");
  const { isOpen, toggle, student } = useGivePointStore();
  const { data } = useGetClasses();
  const mutation = useGivePointStudent();
  const [activeClassId, setActiveClassId] = useState<string>(defaultClassId);
  const { students, onChange: onChangeStudents } = useStudents(activeClassId);
  const {
    pointSuddenly,
    onChange: onChangePointSuddenly,
    onReset: onResetPointSuddenly,
  } = useGivePointSuddenly();
  const {
    students: activeStudents,
    onReset: onResetActiveStudents,
    onChange: onChangeActiveStudents,
    onSelectAll,
  } = useActiveStudents();
  const tToastMessage = useTranslations("toastmessage");
  const { data: dataClass } = useGetStudentGivePoint(activeClassId);
  const { toast } = useToast();
  const studentsApi = dataClass?.students || [];
  const {
    evaluations,
    onChange: onChangeEvaluations,
    onReset: onResetEvaluationsActive,
  } = useEvaluationsActiveGivePoint();

  const isSelectAll = checkArrayContainsAllIds(students, activeStudents);
  const router = useRouter();

  const handleGivePoint = async () => {
    const evaluationsExtraParams = evaluations.extras.map((x) => ({
      note: x.name,
      point: x.point,
      imageUrl: x.imageUrl,
      date: x.date,
    }));
    const evaluationsMinusParams = evaluations.minus.map((x) => ({
      note: x.name,
      point: -x.point,
      imageUrl: x.imageUrl,
      date: x.date,
    }));
    const pointSuddenlyParams = [];
    if (pointSuddenly.extras) {
      pointSuddenlyParams.push({
        note: tGivePoint('addPointSuddenly'),
        point: pointSuddenly.extras,
        imageUrl: "",
        date: new Date().toISOString(),
      });
    }
    if (pointSuddenly.minus) {
      pointSuddenlyParams.push({
        note: tGivePoint('minusPointSuddenly'),
        point: -pointSuddenly.minus,
        imageUrl: "",
        date: new Date().toISOString(),
      });
    }
    const params = [
      ...pointSuddenlyParams,
      ...evaluationsExtraParams,
      ...evaluationsMinusParams,
    ];
    const paramsGivePoint = activeStudents.map((student) => ({
      studentId: student.id.toString(),
      activities: params,
    }));
    if (!isEnableGivePoint) return;
    const result = await mutation.mutateAsync({
      classId: activeClassId,
      params: paramsGivePoint,
    });
    if (result.status === 200) {
      toast({
        title: tToastMessage("success"),
        description: tToastMessage("givePointSuccess"),
      });
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: tToastMessage("error"),
        description: tToastMessage("givePointError"),
      });
    }
  };
  const handleChangeClass = (value: string) => {
    setActiveClassId(value);
    onResetActiveStudents();
  };

  const handleSelectAllStudents = () => {
    onSelectAll(students);
  };

  const handleSearch = (value: string) => {
    if (studentsApi) {
      const filteredStudents = studentsApi.filter((student) =>
        student.nickname.toLowerCase().includes(value.toLowerCase())
      );
      onChangeStudents(filteredStudents);
    }
  };

  const isEnableGivePoint =
    activeStudents.length > 0 &&
    (pointSuddenly.extras !== 0 ||
      pointSuddenly.minus !== 0 ||
      evaluations.extras.length !== 0 ||
      evaluations.minus.length !== 0);

  useEffect(() => {
    if (!isOpen) {
      setActiveClassId(defaultClassId);
      onResetPointSuddenly();
      onResetEvaluationsActive();
    } else {
      const checkStudents = student?.some((item) => !item.isCheckIn);
      if (checkStudents && students.length !== 0) {
        if (student?.length === 1) {
          toggle();
        }
        toast({
          variant: "default",
          title: t("note"),
          description:
            student?.length === 1
              ? tGivePoint("studentNotAttendance", {
                  name: student[0].nickname || student[0].fullName,
                })
              : tGivePoint("notShowStudentNotAttendance"),
        });
      }
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogContent
        className="sm:max-w-[1032px] text-center gap-5"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold capitalize">
            {t("give")} {t("point")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 grid-cols-[362px_1fr]">
          <div className="space-y-2">
            {!!data?.length && (
              <SelectDropDown
                onChange={handleChangeClass}
                list={data}
                initValue={+activeClassId}
              />
            )}
            <div className="border rounded-lg p-3 space-y-3">
              <SearchInput onChange={handleSearch} />
              {!!students?.length ? (
                <>
                  <Students
                    students={students}
                    onChange={onChangeActiveStudents}
                    activeStudents={activeStudents}
                  />
                  {isSelectAll ? (
                    <div className="flex justify-center pt-3 border-t">
                      <Button
                        variant={"ghost"}
                        className="px-3 py-2 flex items-center border border-primary rounded-full gap-1 text-primary"
                        onClick={onResetActiveStudents}
                      >
                        <Image
                          src="/images/icons/completed.svg"
                          alt=""
                          width={24}
                          height={24}
                          className="fill-primary"
                        />
                        <span> {t("removeSelectAll")}</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-center pt-3 border-t">
                      <Button
                        variant={"ghost"}
                        className="px-3 py-2 flex items-center border rounded-full gap-1 "
                        onClick={handleSelectAllStudents}
                      >
                        <Image
                          src="/images/icons/completed.svg"
                          alt=""
                          width={24}
                          height={24}
                        />
                        <span> {t("selectAll")}</span>
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-[306px] w-full flex flex-col justify-center text-sm gap-2">
                  <p>{tGivePoint("notAttendance")}</p>
                  <Link href={`/workspace/class/${activeClassId}/attendance`}>
                    <Button
                      variant="default"
                      className="rounded-full p-4 px-10 min-w-[180px] font-medium"
                      onClick={toggle}
                    >
                      {tGivePoint("goAttendance")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <GivePointEvaluations
            evaluationsActive={evaluations}
            onChange={onChangeEvaluations}
            activeClassId={activeClassId}
            pointSuddenly={pointSuddenly}
            onChangePointSuddenly={onChangePointSuddenly}
          />
        </div>
        <DialogFooter className="sm:justify-center gap-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="rounded-full p-4 px-10 min-w-[180px] font-medium text-md border-[#E7E8EB] text-black capitalize"
            >
              {t("close")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              className={clsx(
                "rounded-full p-4 px-10 min-w-[180px] font-medium text-md capitalize",
                !isEnableGivePoint && "bg-[#E7E8EB] text-[##B5B7C0]"
              )}
              onClick={handleGivePoint}
              disabled={!isEnableGivePoint}
            >
              {t("give")} {t("point")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
