"use client";
import studentRequest, {
  EditStudentParamsType,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import useGetImages from "@/queryHooks/class/useGetImages";
import RemoveClassModal from "@/components/RemoveClassModal";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function EditStudentModalForm({
  initValue,
  toggle,
  onSave,
  handleRemoveStudent,
  isPermission,
  enableRemove,
}: {
  initValue: StudentType;
  toggle: () => void;
  onSave: (item: StudentType) => void;
  handleRemoveStudent?: (id: string) => void;
  isPermission: boolean;
  enableRemove: boolean;
}) {
  const tCommon = useTranslations("common");
  const tToast = useTranslations("toastmessage");
  const t = useTranslations("students");
  const { data } = useGetImages();
  const images = [
    ...(data?.payload.data.boys || []),
    ...(data?.payload.data.girls || []),
  ];
  const { toast } = useToast();
  const router = useRouter();
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
    parentName: z.string(),
    group: z.string().optional(),
    note: z.string().optional(),
    birthday: z.date().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: initValue.nickname,
      fullName: convertValueUndefine(initValue.fullName),
      gender: initValue.gender ? "1" : "0",
      code: initValue.code,
      group: convertValueUndefine(initValue.group?.toString()),
      parentName: convertValueUndefine(initValue.parentName),
      note: convertValueUndefine(initValue.note),
      parentPhone: initValue.parentPhone
        ? initValue.parentPhone.toString()
        : undefined,
      birthday: initValue?.birthday ? new Date(initValue?.birthday) : undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!isPermission) {
        toast({
          variant: "destructive",
          title: tToast("notAuthorized"),
          description: tToast("desNotAuthorizedEdit"),
        });
      } else {
        const {
          gender,
          code,
          birthday,
          parentPhone,
          group,
          fullName,
          ...rest
        } = values;
        const params: EditStudentParamsType = {
          ...rest,
          gender: !!+gender,
          parentPhone: parentPhone ? parentPhone : null,
          group: group ? group : "",
        };
        if (avatar) params.avatar = { id: avatar.id };
        if (fullName) params.fullName = fullName;
        if (birthday) params.birthday = format(birthday!, "yyyy-MM-dd");
        code !== "OLP-" ? (params.code = code) : (params.code = undefined);
        const res = await studentRequest.editStudentModal(
          initValue.id.toString(),
          params
        );
        if (res) {
          router.refresh();
          toast({
            title: tToast("success"),
            description: tToast("editSuccess"),
          });
          const student = {
            ...initValue,
            ...res,
            avatar: avatar || { id: "", url: "" },
          };
          onSave(student);
          toggle();
        } else {
          toast({
            variant: "destructive",
            title: tToast("uniqueCode"),
            description: tToast("changeCode"),
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: tToast("error"),
        description: tToast("desError"),
      });
    }
  }

  const handleOpenComfirm = () => {
    if (!isPermission) {
      toast({
        variant: "destructive",
        title: tToast("notAuthorized"),
        description: tToast("desNotAuthorizedDelete"),
      });
    }
  };

  useEffect(() => {
    setAvatar(initValue ? initValue.avatar : images[0]);
  }, [data]);

  return (
    <>
      <ImagePopover image={avatar} onChangeImage={setAvatar} list={images} />
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
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
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
                <span className="text-quaternary mb-1 text-sm">*</span>
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
          <div className="flex gap-6 pb-8">
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
        </form>
      </Form>
      <div className="space-x-6 flex justify-center">
        {enableRemove ? (
          <RemoveClassModal
            nameButton={tCommon("titleDeleteStudent")}
            title={tCommon("titleDeleteStudent")}
            description={tCommon("desDeleteStudent")}
            handleOpenComfirm={handleOpenComfirm}
            onRemove={() => handleRemoveStudent?.(initValue.id.toString())}
            isPermission={isPermission}
            className="py-0 ml-[inherit]"
          />
        ) : (
          <Button
            className="rounded-full min-w-[180px] border border-[#E7E8EB] font-semibold"
            variant="ghost"
            type="button"
            onClick={toggle}
          >
            {tCommon("back")}
          </Button>
        )}

        <Button
          type="submit"
          form="StudentForm"
          className="rounded-full min-w-[180px] font-semibold"
        >
          {tCommon("save")}
        </Button>
      </div>
    </>
  );
}
