"use client";
import studentRequest, {
  StudentParamsType,
  StudentType,
} from "@/apiRequest/students";
import { ImagePopover } from "@/app/workspace/class/_components/ImagePopover";
import { InputWithLabel } from "@/components/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import useCreateStudent from "@/queryHooks/class/useCreateStudent";
import useGetImages from "@/queryHooks/class/useGetImages";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CreateStudentModalForm({
  classId,
  student,
  toggle,
}: {
  classId: string;
  nameClass: string;
  student?: StudentType;
  toggle: () => void;
}) {
  const tCommon = useTranslations("common");
  const t = useTranslations("students");
  const tToast = useTranslations("toastmessage");
  const { data } = useGetImages();
  const router = useRouter();
  const { toast } = useToast();
  const images = [
    ...(data?.payload.data.boys || []),
    ...(data?.payload.data.girls || []),
  ];
  const [avatar, setAvatar] = useState<{ id: string; url: string } | undefined>(
    undefined
  );
  const convertValueUndefine = (value: any) => (value ? value : undefined);

  const formSchema = z.object({
    nickname: z.string().optional(),
    fullName: z.string().min(1, { message: t("enterFullName") }),
    gender: z.enum(["1", "0"], { message: t("selectGender") }),
    code: z
      .string()
      .regex(/^OLP-(\d{6})?$/, {
        message: t("codeFormat"),
      })
      .optional(),
    parentPhone: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .string()
        .regex(/^\d+$/, { message: tCommon("invalidPhone") })
        .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
          message: tCommon("invalidPhone"),
        })
        .optional()
    ),
    parentName: z.string().optional(),
    group: z.string().optional(),
    note: z.string().optional(),
    birthday: z.date().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: student?.nickname,
      fullName: convertValueUndefine(student?.fullName),
      parentPhone: convertValueUndefine(student?.parentPhone),
      parentName: convertValueUndefine(student?.parentName),
      note: convertValueUndefine(student?.note),
      group: convertValueUndefine(student?.group.toString()),
      gender: student?.gender ? "1" : "0",
      birthday: student?.birthday ? new Date(student?.birthday) : undefined,
      code: student?.code ? student?.code : "",
    },
  });
  const mutationCreateStudent = useCreateStudent();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { birthday, gender, group, note, code, ...rest } = values;
      const params: StudentParamsType = {
        ...rest,
        class: classId,
        gender: !!+gender,
      };
      if (avatar) params.avatar = { id: avatar.id };
      if (birthday) params.birthday = format(birthday!, "yyyy-MM-dd");
      if (note) params.note = note;
      if (group) params.group = group;
      code !== "OLP-" ? (params.code = code) : (params.code = undefined);
      const res = await mutationCreateStudent.mutateAsync(params);
      if (res?.status === 200) {
        toast({
          title: tToast("success"),
          description: tToast("createStudentSuccess"),
        });
        router.refresh();
        toggle();
      } else {
        toast({
          variant: "destructive",
          title: tToast("error"),
          description: tToast("desError"),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: tToast("error"),
        description: tToast("desError"),
      });
    }
  }

  useEffect(() => {
    setAvatar(student ? student.avatar : images[0]);
  }, [data]);

  return (
    <>
      {avatar && (
        <ImagePopover image={avatar} onChangeImage={setAvatar} list={images} />
      )}
      <Form {...form}>
        <form
          id="StudentForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 sm:max-h-[350px] overflow-y-scroll"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex gap-6">
            <InputWithLabel
              fieldTitle={`${tCommon(
                "shortName"
              )} <span class="text-[#F4673D] mb-1 text-sm">(John/Mỹ Linh/...)</span>`}
              nameInSchema="nickname"
              className="flex-1"
              placeholder={tCommon("shortName")}
            />
            <InputWithLabel
              fieldTitle={`${tCommon(
                "fullName"
              )} <span class="text-[#F4673D] mb-1 text-sm">*</span>`}
              nameInSchema="fullName"
              className="flex-1"
              placeholder={tCommon("fullName2")}
            />
          </div>
          <div className="flex gap-6">
            <div className="flex-1 space-y-2">
              <Label className="block mb-1 font-medium">
                <p>
                  {tCommon("dateOfBirth")}{" "}
                  <span className="text-[#F4673D] mb-1 text-sm">
                    ({t("example")}: 19/05/2015)
                  </span>
                </p>
              </Label>
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left py-6 text-lg font-medium border-input text-muted-foreground",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>dd/mm/yyyy</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-muted-foreground" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          className="min-w-[300px] flex justify-center"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 space-y-4">
              <Label className="block mb-1 font-medium">
                {tCommon("gender")}{" "}
                <span className="text-[#F4673D] mb-1 text-sm">*</span>{" "}
              </Label>
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-2 text-lg"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="1" />
                          </FormControl>
                          <FormLabel className="text-lg cursor-pointer">
                            {tCommon("male")}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="0" />
                          </FormControl>
                          <FormLabel className="text-lg cursor-pointer">
                            {tCommon("female")}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex gap-6">
            <InputWithLabel
              fieldTitle={tCommon("parentsName")}
              nameInSchema="parentName"
              className="flex-1"
              placeholder={tCommon("parentsName")}
            />
            <InputWithLabel
              fieldTitle={tCommon("parentsPhone")}
              nameInSchema="parentPhone"
              className="flex-1"
              placeholder={tCommon("parentsPhone")}
              type="tel"
            />
          </div>
          <div className="flex gap-6">
            <InputWithLabel
              fieldTitle={tCommon("note")}
              nameInSchema="note"
              className="flex-1"
              placeholder={tCommon("note")}
            />
            <InputWithLabel
              fieldTitle={tCommon("code")}
              nameInSchema="code"
              className="flex-1"
              prefix="OLP-"
            />
            <InputWithLabel
              fieldTitle={tCommon("groupLong")}
              nameInSchema="group"
              className="flex-1"
              placeholder={tCommon("groupLong")}
            />
          </div>
          <div></div>
        </form>
      </Form>
      <div className="space-x-6 flex justify-center">
        <Button
          className="rounded-full min-w-[180px] border border-[#E7E8EB] font-semibold"
          variant="ghost"
          type="button"
          onClick={toggle}
        >
          {tCommon("back")}
        </Button>
        <Button
          type="submit"
          form="StudentForm"
          className="rounded-full min-w-[180px] font-semibold"
          loading={mutationCreateStudent.isPending}
        >
          {tCommon("save")}
        </Button>
      </div>
    </>
  );
}
