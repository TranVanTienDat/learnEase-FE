"use client";
import classRequest from "@/apiRequest/class";
import { InputWithLabel } from "@/components/InputWithLabel";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MonthRangePicker } from "@/components/ui/month-range-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import useModals from "@/hooks/useModals";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarDaysIcon, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AddNewCourse({ classId }: { classId: string }) {
  const tCommon = useTranslations("common");
  const t = useTranslations("courseManagement");
  const tToastMessage = useTranslations("toastmessage");
  const { toast } = useToast();
  const router = useRouter();
  const { toggle, modal: AddNewCourseModal } = useModals();

  const formSchema = z.object({
    name: z.string().min(1, { message: tCommon("invalidInput") }),
    duration: z
      .object({
        start: z.date(),
        end: z.date(),
      })
      .partial()
      .refine((data) => data.start && data.end, {
        message: tCommon("invalidInput"),
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      duration: {
        start: undefined,
        end: undefined,
      },
    },
  });

  const handleAddCourse = async (values: z.infer<typeof formSchema>) => {
    const data = {
      ...values,
      duration: `${format(values.duration.start || "", "MM/yyyy")} - ${format(
        values.duration.end || "",
        "MM/yyyy"
      )}`,
      class: classId,
    };
    const response = await classRequest.CreateCourseByClassId({
      data,
    });

    if (response.status === 200) {
      toast({
        title: tToastMessage("success"),
        description: t("createCourseSuccess"),
      });
      form.reset({
        name: "",
        duration: {
          start: undefined,
          end: undefined,
        },
      });
      toggle();
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: tToastMessage("error"),
        description: t("createCourseError"),
      });
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    handleAddCourse(values);
  }

  return (
    <>
      <Button className="flex items-center gap-2 rounded-full" onClick={toggle}>
        <Plus />
        <span>{t("addCourse")}</span>
      </Button>

      <AddNewCourseModal title={t("addNewCourse")}>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="flex gap-5">
                <InputWithLabel
                  fieldTitle={tCommon("courseName")}
                  nameInSchema="name"
                  placeholder={tCommon("courseName")}
                  className="flex-1"
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel className="text-base font-medium capitalize">
                        {tCommon("duration")}
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "text-left font-normal flex items-center justify-between h-[50px] text-[16px] border-input text-foreground",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value?.start && field.value?.end ? (
                                `${format(
                                  field.value.start,
                                  "MM/yyyy"
                                )} - ${format(field.value.end, "MM/yyyy")}`
                              ) : (
                                <span className="capitalize text-[#B5B7C0] pr-2">
                                  {t("chooseDuration")}
                                </span>
                              )}
                              <CalendarDaysIcon className="h-5 w-5 text-[#B5B7C0]" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <MonthRangePicker
                            onMonthRangeSelect={(newDates) =>
                              form.setValue("duration", newDates)
                            }
                            selectedMonthRange={
                              field.value.start && field.value.end
                                ? {
                                    start: field.value.start as Date,
                                    end: field.value.end as Date,
                                  }
                                : undefined
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-5 justify-center mt-[20px]">
                <Button
                  className="rounded-full p-4 px-10 min-w-[180px] font-medium text-md"
                  type="button"
                  onClick={toggle}
                >
                  {tCommon("close")}
                </Button>
                <Button
                  type="submit"
                  className="rounded-full p-4 px-10 min-w-[180px] font-medium text-md"
                >
                  {t("addNew")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </AddNewCourseModal>
    </>
  );
}
