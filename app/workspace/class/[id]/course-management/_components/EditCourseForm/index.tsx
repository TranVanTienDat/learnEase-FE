import classRequest from "@/apiRequest/class";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { memo, useMemo, useState } from "react";

const EditCourseFormItem = ({
  list,
  className,
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
          />
        </div>
      ))}
    </div>
  );
};

const EditSubjectFormItemMemo = memo(EditCourseFormItem);

type Point = {
  name: string;
  coefficient: number;
  id: number | string;
};

type CourseType = {
  id: number | string;
  stt: string | number;
  name: string;
  duration: string;
};

export default function EditCourseForm({
  course: initCourse,
  classId,
  toggleRemove,
}: {
  course: CourseType;
  classId: string;
  toggleRemove: () => void;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const tCommon = useTranslations("common");
  const tToastMessage = useTranslations("toastmessage");
  const t = useTranslations("courseManagement");
  const [editCourse, setEditCourse] = useState(initCourse);

  const handleChangeCourse = (
    id: number | string,
    value: string,
    key: keyof CourseType
  ) => {
    setEditCourse((prev) => ({ ...prev, [key]: value }));
  };
  const debouncePoints = useDebounce(
    (id: number | string, value: string, key: keyof CourseType) =>
      handleChangeCourse(id, value, key),
    500
  );

  const handleUpdate = async () => {
    if (!editCourse.name) {
      toast({
        variant: "destructive",
        title: tToastMessage("error"),
        description: tCommon("invalidInput"),
      });
      return;
    }

    const data = {
      class: classId,
      name: editCourse.name,
      duration: editCourse.duration,
    };
    const response = await classRequest.updateCourseByClassId({
      id: editCourse.id,
      data,
    });
    if (response.status === 200) {
      toast({
        title: tToastMessage("success"),
        description: t("editCourseSuccess"),
      });
      router.refresh();
      toggleRemove();
    } else {
      toast({
        variant: "destructive",
        title: tToastMessage("error"),
        description: t("editCourseError"),
      });
    }
  };

  const memoCourse = useMemo(
    () => ({
      ...editCourse,
      list: [
        {
          value: editCourse.name,
          label: tCommon("courseName"),
          key: "name",
        },
        {
          value: editCourse.duration,
          label: tCommon("duration"),
          key: "duration",
          readOnly: true,
        },
      ],
    }),
    [editCourse, tCommon]
  );

  return (
    <div className="max-h-[500px] overflow-y-auto table-wrapper">
      <div className="flex flex-col gap-6 pr-2">
        <div className="flex flex-col gap-4">
          <EditSubjectFormItemMemo
            key={memoCourse.id}
            list={memoCourse.list}
            onChange={(value, key) => {
              debouncePoints(memoCourse.id, value, key as keyof CourseType);
            }}
          />
        </div>

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
            {tCommon("save")}
          </Button>
        </DialogFooter>
      </div>
    </div>
  );
}
