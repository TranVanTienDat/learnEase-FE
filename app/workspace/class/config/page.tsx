"use client";
import EvaluationTabs from "@/app/workspace/class/config/_components/EvaluationTabs";
import BackTitle from "@/components/BackTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useGetConfigClass from "@/queryHooks/class/useGetConfigClass";
import useSaveConfigCommon from "@/queryHooks/class/useSaveConfigCommon";
import { FeatureType, IFeature } from "@/types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const InputItem = ({
  label,
  value = "",
  content,
}: {
  label: string;
  value?: string;
  content?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label dangerouslySetInnerHTML={{ __html: label }} />
      <Input
        className="text-[22px] font-semibold py-6"
        type="text"
        defaultValue={value}
        readOnly
      />
      {content && <p>{content}</p>}
    </div>
  );
};

export default function Page() {
  const { data } = useGetConfigClass();
  const mutation = useSaveConfigCommon();
  const tCommon = useTranslations("common");
  const t = useTranslations("configuration");
  const tToastMessage = useTranslations("toastmessage");
  const { toast } = useToast();
  const [extraEvaluations, setExtraEvaluations] = useState(
    data?.payload?.evaluations.filter(
      (item: IFeature) => item.type === FeatureType.EXTRA
    )
  );
  const [minusEvaluations, setMinusEvaluations] = useState(
    data?.payload?.evaluations.filter(
      (item: IFeature) => item.type === FeatureType.MINUS
    )
  );

  console.log("data", data);

  useEffect(() => {
    setExtraEvaluations(
      data?.payload?.evaluations.filter(
        (item: IFeature) => item.type === FeatureType.EXTRA
      )
    );
    setMinusEvaluations(
      data?.payload?.evaluations.filter(
        (item: IFeature) => item.type === FeatureType.MINUS
      )
    );
  }, [data]);

  const handleSaveInfo = () => {
    const evaluations = [...extraEvaluations, ...minusEvaluations];
    mutation.mutate(evaluations);
    toast({
      title: tCommon("saveInformation"),
      description: tToastMessage("success"),
    });
  };

  return (
    <div className="container">
      <div className="pb-10">
        <EvaluationTabs
          minusEvaluations={minusEvaluations}
          extraEvaluations={extraEvaluations}
          onChangeMinus={setMinusEvaluations}
          onChangeExtra={setExtraEvaluations}
        />
        <div className="flex gap-6 mt-6 justify-end">
          <Button
            className="rounded-full p-6 px-4 min-w-[100px] font-semibold"
            onClick={handleSaveInfo}
          >
            Lưu
          </Button>
        </div>
      </div>
    </div>
  );
}
