import classRequest from "@/apiRequest/class";
import { LoadingSnipper } from "@/components/LoadingSnipper";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { SquareMinus, SquarePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const EditSubjectFormItem = ({
  list,
  className,
  onDelete,
  onChange,
}: {
  list: {
    value: string;
    label: string;
    readOnly?: boolean;
    type?: string;
    key?: string;
  }[];
  className?: string;
  onDelete?: () => void;
  onChange?: (value: string, key: string) => void;
}) => {
  return (
    <div className={cn("flex gap-3", className)}>
      {list.map((item, index) => (
        <div key={index} className="flex-1">
          <Label>{item.label}</Label>
          <Input
            defaultValue={item.value}
            className={cn(
              "mt-2",
              item.readOnly && "bg-[#F5F5F5] text-[#9A9FA9]"
            )}
            readOnly={item.readOnly}
            onChange={(e) => {
              if (item.key) {
                onChange?.(e.target.value, item.key);
              }
            }}
            type={item.type || "text"}
            onKeyDown={(e) => {
              if (
                item.type === "number" &&
                (e.key === "e" ||
                  e.key === "E" ||
                  e.key === "+" ||
                  e.key === "-")
              ) {
                e.preventDefault();
              }
            }}
          />
        </div>
      ))}
      {onDelete && (
        <Button
          variant="ghost"
          className="p-0 h-auto self-end mb-2 w-5 text-[#F25B2C] hover:text-primary"
          onClick={onDelete}
        >
          <SquareMinus />
        </Button>
      )}
    </div>
  );
};

const EditSubjectFormItemMemo = memo(EditSubjectFormItem);

type Point = {
  name: string;
  coefficient: number;
  id: number | string;
};

export default function EditSubjectForm({
  toggleRemove,
  subjectId,
  params,
}: {
  toggleRemove: () => void;
  subjectId: string | number;
  params: { id: string };
}) {
  const { toast } = useToast();
  const tCommon = useTranslations("common");
  const tToastMessage = useTranslations("toastmessage");
  const t = useTranslations("subjectManagement");
  const [points, setPoints] = useState<Point[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [subject, setSubject] = useState({
    id: -1,
    headSubject: [
      { value: "", label: tCommon("subjectCode"), readOnly: true },
      { value: "", label: tCommon("subjectName"), readOnly: true },
    ],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await classRequest.getClassSubjectGrandingBreakdown(
          subjectId
        );
        if (data) {
          setPoints(data.grandingBreakdown);
          setSubject((prevSubject) => ({
            ...prevSubject,
            id: data.subject.id,
            headSubject: [
              { ...prevSubject.headSubject[0], value: data.subject.code },
              { ...prevSubject.headSubject[1], value: data.subject.name },
            ],
          }));
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: tToastMessage("error"),
          description: tCommon("fetchSubjectErr"),
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectId]);

  const handleChangePoints = (
    id: number | string,
    value: string,
    key: keyof Point
  ) => {
    setPoints((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [key]: key === "coefficient" ? Number(value) : value,
          };
        }
        return item;
      });
    });
  };
  const debouncePoints = useDebounce(
    (id: number | string, value: string, key: keyof Point) =>
      handleChangePoints(id, value, key),
    100
  );
  const handleUpdate = async () => {
    const isEnoughField = points.every((point) => {
      return point.name && point.coefficient;
    });
    const totalCoefficient = points.reduce((prev, current) => {
      return prev + +current.coefficient;
    }, 0);
    const isAllowUpdate = isEnoughField && totalCoefficient === 100;
    if (!isEnoughField) return setErrorMessage(t("pleaseEnterEnoughField"));
    if (totalCoefficient !== 100) return setErrorMessage(t("sum100"));
    if (isAllowUpdate) {
      const data = {
        class: params.id,
        subject: subject.id,
        grandingBreakdown: [
          ...points.map((point) => {
            if (Number(point.id)) return point;
            return { coefficient: point.coefficient, name: point.name };
          }),
        ],
      };
      const response = await classRequest.updateSubject({
        id: subjectId,
        data,
      });
      if (response.status === 200) {
        toast({
          title: tToastMessage("success"),
          description: tCommon("updateSubjectSuccess"),
        });
        toggleRemove();
      } else {
        toast({
          variant: "destructive",
          title: tToastMessage("error"),
          description: tCommon("updateSubjectErr"),
        });
      }
    }
  };
  const handleAdd = () => {
    setPoints((prev) => {
      return [
        ...prev,
        {
          id: uuidv4(),
          coefficient: 0,
          name: "",
        },
      ];
    });
  };

  const memoPoints = useMemo(
    () =>
      points.map((item) => ({
        ...item,
        list: [
          {
            value: item.name,
            label: t("coefficientName"),
            key: "name",
          },
          {
            value: item.coefficient.toString(),
            label: `${t("coefficient")}(%)`,
            key: "coefficient",
            type: "number",
          },
        ],
      })),
    [points, t]
  );

  return (
    <>
      {!loading ? (
        <div className="max-h-[500px] overflow-y-auto table-wrapper">
          <div className="flex flex-col gap-6 pr-2">
            <EditSubjectFormItemMemo
              list={subject.headSubject}
              className="gap-"
            />
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <h3 className="font-bold leading-none">
                  {t("pointCoefficient")}
                </h3>
                <Button
                  variant="ghost"
                  className="p-0 h-auto self-end w-5 text-primary"
                  onClick={handleAdd}
                >
                  <SquarePlus />
                </Button>
              </div>
              {memoPoints.map((item, index) => (
                <EditSubjectFormItemMemo
                  key={item.id}
                  list={item.list}
                  onDelete={() => {
                    setPoints((prev) => {
                      const index = prev.findIndex((i) => i.name === item.name);
                      prev.splice(index, 1);
                      return [...prev];
                    });
                  }}
                  onChange={(value, key) => {
                    debouncePoints(item.id, value, key as keyof Point);
                  }}
                />
              ))}
            </div>
            {errorMessage && (
              <p className="text-quaternary text-sm">{errorMessage}</p>
            )}
            <DialogFooter className="sm:justify-center gap-4">
              <Button
                variant="outline"
                className="rounded-full p-6 px-10 min-w-[180px] font-medium text-md"
                onClick={toggleRemove}
              >
                {tCommon("close")}
              </Button>
              <Button
                className="rounded-full p-6 px-10 min-w-[180px] font-medium text-md"
                onClick={handleUpdate}
              >
                {tCommon("update")}
              </Button>
            </DialogFooter>
          </div>
        </div>
      ) : (
        <LoadingSnipper />
      )}
    </>
  );
}
