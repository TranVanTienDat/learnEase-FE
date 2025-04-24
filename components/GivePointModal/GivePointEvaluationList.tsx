import GivePointEvaluationItem from "@/components/GivePointModal/GivePointEvaluationItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeatureType } from "@/types";
import {
  EvaluationsActiveGivePointType,
  EvaluationsActiveType,
  GivePointEvaluationType,
} from "@/types/giveModal";

const GivePointEvaluationList = ({
  list,
  type,
  evaluationsActive,
  onChange,
}: {
  list: GivePointEvaluationType[];
  type: FeatureType;
  onChange: (
    evaluation: EvaluationsActiveGivePointType,
    type: "extras" | "minus"
  ) => void;
  evaluationsActive: EvaluationsActiveType;
}) => {
  return (
    <ScrollArea className="h-[300px]">
      <div className="grid grid-cols-3 gap-5">
        {list.map((item) => {
          const handleSelect = () => {
            const itemParams = {
              id: item.id,
              name: item.name,
              point: item.point,
              imageUrl: item.image?.url || "",
              date: new Date().toISOString(),
            };
            onChange(
              itemParams,
              type === FeatureType.EXTRA ? "extras" : "minus"
            );
          };
          return (
            <GivePointEvaluationItem
              key={item.name}
              onSelect={handleSelect}
              image={item.image}
              name={item.name}
              point={item.point}
              isActive={evaluationsActive?.[
                type === FeatureType.EXTRA ? "extras" : "minus"
              ]?.some((evaluation) => evaluation.id === item.id)}
              type={type}
              id={item.id}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default GivePointEvaluationList;
