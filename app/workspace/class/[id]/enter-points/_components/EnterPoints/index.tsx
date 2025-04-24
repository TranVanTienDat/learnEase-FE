"use client";
import FilterTerm from "@/app/workspace/class/[id]/enter-points/_components/FilterTerm";
import SubjectsTab from "@/app/workspace/class/[id]/enter-points/_components/SubjectsTab";
import BackTitle from "@/components/BackTitle";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useUpdatePoint from "@/queryHooks/class/useUpdatePoint";
import { ConductType } from "@/types/points";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EnterPoints({
  classId,
  seasons,
  subjects,
  students,
  grandingBreakdowns,
  points,
  seasonParams,
}: {
  classId: string;
  seasons: any[];
  subjects: any[];
  points: any[];
  students: any[];
  grandingBreakdowns: any[];
  seasonParams: string;
}) {
  const tCommon = useTranslations("common");
  const tToast = useTranslations("toastmessage");
  const mutation = useUpdatePoint();
  const [pointsChange, setPointsChange] = useState<any[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const handleUpdatePoints = async () => {
    try {
      const res = await Promise.allSettled(
        pointsChange.map((x) =>
          mutation.mutateAsync({
            seasonId: seasonParams,
            studentId: x?.student?.id,
            subjectId: x?.subject?.id,
            score: x.score,
            grandingBreakdownId: x.grandingBreakdown?.id,
          })
        )
      );
      if (
        res.every((x) => x.status === "fulfilled" && x?.value?.status == 200)
      ) {
        toast({
          title: tToast("success"),
        });
        setPointsChange([]);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: tToast("error"),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: tToast("error"),
      });
    }
  };
  const [conducts, setConducts] = useState<ConductType[]>([]);
  const searchParams = useSearchParams();
  const handleUpdateConduct = async (conduct: ConductType) => {
    if (conducts.some((x) => x?.studentId === conduct?.studentId)) {
      const index = conducts.findIndex(
        (x) => x?.studentId === conduct?.studentId
      );
      conducts.splice(index, 1, conduct);
    } else {
      conducts.push(conduct);
    }
    setConducts([...conducts]);
  };
  const handleChangeConduct = async () => {
    try {
      const res = await Promise.allSettled(
        conducts.map((x) =>
          mutation.mutateAsync({
            seasonId: seasonParams,
            studentId: x.studentId.toString(),
            grandingBreakdownId: null,
            conduct: x.conduct,
          })
        )
      );
      if (
        res.every((x) => x.status === "fulfilled" && x?.value?.status == 200)
      ) {
        toast({
          title: tToast("success"),
        });
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: tToast("error"),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: tToast("error"),
      });
    }
  };
  const handleSave = () => {
    if (conducts.length > 0) handleChangeConduct();
    if (pointsChange.length > 0) handleUpdatePoints();
  };
  const pathname = usePathname();

  const handleChangeFilterTerm = (value: string) => {
    router.replace(
      `${pathname}?season=${value}&subject=${
        searchParams.get("subject") || subjects[0].value
      }`
    );
    router.refresh();
  };

  const handleChangeSubject = (value: string) => {
    router.push(`${pathname}?season=${seasonParams}&subject=${value}`);
  };

  useEffect(() => {
    if (searchParams.get("subject") !== "classificationConduct") {
      setConducts([]);
    }
  }, [searchParams]);

  return (
    <>
      <div className="flex items-center justify-between pb-[10px]">
        <BackTitle url={`/workspace/class/${classId}`}>
          <h1 className="capitalize text-[32px] font-bold">
            {tCommon("enterPoints")}
          </h1>
        </BackTitle>
        <Button
          disabled={!pointsChange.length && !conducts.length}
          onClick={handleSave}
        >
          {tCommon("save")}
        </Button>
      </div>
      <div className="relative">
        {!!seasons?.length && (
          <FilterTerm
            list={seasons.map((x) => ({
              ...x,
              id: x.id.toString(),
            }))}
            onChange={handleChangeFilterTerm}
            initValue={seasonParams.toString()}
            className="custom-position"
          />
        )}
        {!!subjects?.length && (
          <SubjectsTab
            subjects={subjects}
            students={students}
            grandingBreakdowns={grandingBreakdowns}
            points={points}
            key={seasonParams}
            onChangePoints={setPointsChange}
            onChangeConduct={handleUpdateConduct}
            onChangeSubject={handleChangeSubject}
          />
        )}
      </div>
    </>
  );
}
