"use client";
import studentRequest from "@/apiRequest/students";
import { InputWithLabel } from "@/components/InputWithLabel";
import { LoadingSnipper } from "@/components/LoadingSnipper";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

export default function ClassPhoneForm({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = useTranslations("studyTracking");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [isErr, setIsErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    phoneNumber: z
      .string()
      .min(1, { message: t("invalidInput") })
      .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
        message: t("invalidPhoneNumber"),
      }),
    code: z.string().min(1, { message: t("invalidInput") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: (searchParams.classId as string) ?? "",
      phoneNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { code, phoneNumber } = values;
    setIsLoading(true);
    const data = await studentRequest.getConductStudent(
      Number(code),
      phoneNumber
    );
    if (!!data?.length) {
      router.push(
        `study-tracking/${code}?phoneNumber=${phoneNumber}&studentId=${searchParams.studentId}`
      );
    } else {
      setIsErr(true);
    }
    setIsLoading(false);
  }

  const handleFocus = () => {
    if (isErr) setIsErr(false);
  };

  return (
    <div className="mb-9 h-[600px] mt-[80px] pt-[110px] container">
      <div className="max-w-[736px] mx-auto mt-5 bg-[#F8F8F8]">
        <div className="p-5 bg-primary rounded-t-xl text-center">
          <p className="font-bold text-xl text-white">{t("seeResultStudy")}</p>
        </div>

        <Form {...form}>
          <form id="btn-submit" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-10 justify-center items-center p-5 rounded-b-xl">
              <InputWithLabel
                fieldTitle={t("enterCodeClass")}
                className="rounded-lg w-full"
                placeholder={t("codeClass")}
                nameInSchema="code"
                type="text"
                onFocus={handleFocus}
              />
              <InputWithLabel
                fieldTitle={t("enterPhone")}
                className="rounded-lg w-full"
                nameInSchema="phoneNumber"
                placeholder={t("phoneNumber")}
                type="tel"
                onFocus={handleFocus}
              />

              <Button
                className={cn(
                  "px-12 py-0 rounded-full",
                  isErr ? "bg-[#E7E8EB] text-[#CBD5E1] hover:bg-[#E7E8EB]" : ""
                )}
                type="submit"
                form="btn-submit"
              >
                {isLoading ? <LoadingSnipper /> : t("seeInfo")}
              </Button>
              {isErr && (
                <p className="text-[#E02B1E] text-sm font-normal mt-2">
                  {t("errMess")}
                </p>
              )}
            </div>
          </form>
        </Form>
      </div>
      <div className="text-[14px] font-normal text-[#0F1834] text-center mt-[20px]">
        {t("note")}
        <strong>{` ${t("codeClass")} `}</strong> {t("and")}
        <strong>{` ${t("phoneNumber")}.`}</strong>
      </div>
    </div>
  );
}
