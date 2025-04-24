"use client";
import GivePointEvaluationList from "@/components/GivePointModal/GivePointEvaluationList";
import GivePointSuddenly from "@/components/GivePointModal/GivePointSuddenly";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetStudentGivePoint from "@/queryHooks/class/useGetStudentGivePoint";
import { FeatureType, IFeature } from "@/types";
import {
  EvaluationsActiveGivePointType,
  EvaluationsActiveType,
} from "@/types/giveModal";
import { useTranslations } from "next-intl";

export default function GivePointEvaluations({
  onChange,
  evaluationsActive,
  activeClassId,
  pointSuddenly,
  onChangePointSuddenly,
}: {
  onChange: (
    evaluation: EvaluationsActiveGivePointType,
    type: "extras" | "minus"
  ) => void;
  evaluationsActive: EvaluationsActiveType;
  activeClassId: string;
  pointSuddenly: {
    extras: number;
    minus: number;
  }; 
  onChangePointSuddenly: (type: "extras" | "minus", value: number) => void;
}) {
  const { data } = useGetStudentGivePoint(activeClassId);
  const t = useTranslations("givePoint");

  const evaluations = data?.evaluations || [];

  const extras =
    evaluations?.filter((item: IFeature) => item.type === FeatureType.EXTRA) ||
    [];
  const minus =
    evaluations.filter((item: IFeature) => item.type === FeatureType.MINUS) ||
    [];
  return (
    <Tabs defaultValue="extra" className="bg-[#F4F4F4] p-5 rounded-2xl">
      <TabsList className="grid w-full grid-cols-2 max-w-[340px] mx-auto bg-white rounded-full p-0 overflow-hidden h-auto border border-[#E7E8EB]">
        <TabsTrigger value="extra" className="font-bold py-2 rounded-none ">
          {t("extraCriteria")}
        </TabsTrigger>
        <TabsTrigger value="minus" className="font-bold py-2 rounded-none">
          {t("minusCriteria")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="extra" className="mt-6">
        {!!extras?.length && (
          <GivePointEvaluationList
            list={extras}
            type={FeatureType.EXTRA}
            onChange={onChange}
            evaluationsActive={evaluationsActive}
          />
        )}
        <GivePointSuddenly
          type={FeatureType.EXTRA}
          initValue={pointSuddenly.extras}
          onChange={onChangePointSuddenly}
        />
      </TabsContent>
      <TabsContent value="minus" className="mt-6">
        {!!minus?.length && (
          <GivePointEvaluationList
            list={minus}
            type={FeatureType.MINUS}
            onChange={onChange}
            evaluationsActive={evaluationsActive}
          />
        )}
        <GivePointSuddenly
          type={FeatureType.MINUS}
          initValue={pointSuddenly.minus}
          onChange={onChangePointSuddenly}
        />
      </TabsContent>
    </Tabs>
  );
}
