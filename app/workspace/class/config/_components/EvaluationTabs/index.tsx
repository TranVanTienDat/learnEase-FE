"use client";
import Evaluations from "@/app/workspace/class/config/_components/Evaluations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureType, IEditEvaluation, IFeature } from "@/types";
import { useTranslations } from "next-intl";

export default function EvaluationTabs({
  extraEvaluations,
  minusEvaluations,
  onChangeMinus: setMinusEvaluations,
  onChangeExtra: setExtraEvaluations,
}: {
  extraEvaluations: IFeature[];
  minusEvaluations: IFeature[];
  onChangeMinus: (value: IFeature[]) => void;
  onChangeExtra: (value: IFeature[]) => void;
}) {
  const t = useTranslations("evaluation");

  const handleAdd = ({
    type,
    value,
  }: {
    type: FeatureType;
    value: IFeature;
  }) => {
    if (type === FeatureType.EXTRA)
      setExtraEvaluations([...extraEvaluations, value]);
    else setMinusEvaluations([...minusEvaluations, value]);
  };

  const handleEdit = ({ type, index, value }: IEditEvaluation) => {
    if (type === FeatureType.EXTRA) {
      const newExtraEvaluations = [...extraEvaluations];
      newExtraEvaluations[+index] = value;
      setExtraEvaluations(newExtraEvaluations);
    } else {
      const newMinusEvaluations = [...minusEvaluations];
      newMinusEvaluations[+index] = value;
      setMinusEvaluations(newMinusEvaluations);
    }
  };

  const handleRemove = ({
    type,
    index,
  }: {
    type: FeatureType;
    index: string;
  }) => {
    if (type === FeatureType.EXTRA) {
      const newExtraEvaluations = [...extraEvaluations];
      newExtraEvaluations.splice(+index, 1);
      setExtraEvaluations(newExtraEvaluations);
    } else {
      const newMinusEvaluations = [...minusEvaluations];
      newMinusEvaluations.splice(+index, 1);
      setMinusEvaluations(newMinusEvaluations);
    }
  };

  return (
    <Tabs defaultValue="extra" className="bg-[#F4F4F4] p-5 rounded-2xl">
      <TabsList className="grid w-full grid-cols-2 max-w-[340px] mx-auto bg-white rounded-full p-0 overflow-hidden h-auto border border-[#E7E8EB]">
        <TabsTrigger value="extra" className="font-bold py-2 rounded-none">
          Phiếu điểm cộng
        </TabsTrigger>
        <TabsTrigger value="minus" className="font-bold py-2 rounded-none">
          Phiếu điểm trừ
        </TabsTrigger>
      </TabsList>
      <TabsContent value="extra" className="mt-6">
        <Evaluations
          list={extraEvaluations}
          type={FeatureType.EXTRA}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
      </TabsContent>
      <TabsContent value="minus" className="mt-6">
        <Evaluations
          list={minusEvaluations}
          type={FeatureType.MINUS}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
      </TabsContent>
    </Tabs>
  );
}
