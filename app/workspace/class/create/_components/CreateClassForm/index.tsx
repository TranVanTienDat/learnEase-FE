"use client";
import classRequest from "@/apiRequest/class";
import { InputWithLabel } from "@/components/InputWithLabel";
import { LoadingSnipper } from "@/components/LoadingSnipper";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MonthRangePicker } from "@/components/ui/month-range-picker";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { SUBJECT_MOCKS } from "@/constants/mock";
import { cn } from "@/lib/utils";
import useCreateClassByImportExcel from "@/queryHooks/class/useCreateClassByImportExcel";
import useCreateClassNormal from "@/queryHooks/class/useCreateClassNormal";
import useGetConfigCommon from "@/queryHooks/class/useGetConfigCommon";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarDaysIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import { z } from "zod";

type StudentTableType = {
  head: Array<string>;
  body: Array<Array<string>>;
} | null;

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
const nameHead = [
  "order",
  "fullName",
  "callShortName",
  "gender",
  "phoneNumber",
  "groupLong",
];
const ExcelAddListStudents = ({
  onChangeFileUpload,
  setStudentsExcel,
}: {
  onChangeFileUpload: (file: File) => void;
  setStudentsExcel: Dispatch<SetStateAction<any[]>>;
}) => {
  const t = useTranslations("class");
  const tCommon = useTranslations("common");

  const { data } = useGetConfigCommon();
  const [studentTable, setStudentTable] = useState<StudentTableType>({
    head: [],
    body: [],
  });
  const [loading, setLoading] = useState(false);
  const handleFileChange = (event: HTMLInputEvent) => {
    setLoading(true);
    const file = event?.target?.files?.[0];
    if (
      !file ||
      file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      alert(t("alertTitleXlsx"));
      return;
    }
    event.target.value = "";
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const arrayBuffer = e?.target?.result;
      const workbook = XLSX.read(arrayBuffer, { type: "binary" });
      const firstSheet = workbook.SheetNames[0];
      const data = convertObjectWB(workbook);
      const tableData = data?.[firstSheet]?.filter?.((x: any) => x.length > 0);
      const headTable = tableData[3];
      const bodyTable = tableData.splice(4);
      if (headTable.length != 6 || !isValidFile(convertDataTable(bodyTable))) {
        setLoading(false);
        setStudentTable({
          head: [],
          body: [],
        });
        alert(t("fileUploadInvalid"));
      } else {
        setLoading(false);
        setStudentTable({
          head: nameHead,
          body: convertDataTable(bodyTable),
        });
        setStudentsExcel(convertDataTable(bodyTable));
      }
      onChangeFileUpload(file);
      return data;
    };
    reader.readAsArrayBuffer(file);
  };

  const isValidFile = (data: any) => data.every((row: any) => row.length === 6);

  function convertObjectWB(workbook: any) {
    let result: any = {};
    workbook.SheetNames.forEach(function (sheetName: string) {
      var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });

      if (roa.length) result[sheetName] = roa;
    });
    return result;
  }

  const convertDataTable = (
    array: Array<Array<string>>
  ): Array<Array<string>> => {
    return array.map((row) => {
      const modifiedRow = [];
      for (let i = 0; i < row.length; i++) {
        if (i === 2) {
          if (row[2] !== undefined) {
            modifiedRow.push(row[2]);
          } else {
            modifiedRow.push(row[1] !== undefined ? row[1] : "");
          }
        } else if (row[i] === undefined) {
          modifiedRow.push("");
        } else {
          modifiedRow.push(row[i]);
        }
      }

      while (modifiedRow.length < 6) {
        modifiedRow.push("");
      }

      return modifiedRow;
    });
  };

  return (
    <div className="space-y-4 text-center">
      <div className="flex gap-8">
        <div className="flex-1 space-y-4 bg-[#FAFAFA] rounded-xl p-5 px-3">
          <div className="relative flex justify-between">
            <label
              htmlFor="fileInput"
              className="cursor-pointer text-primary underline   text-base inline-block"
            >
              thêm học sinh bằng Excel
            </label>
            <Input
              type="file"
              id="fileInput"
              accept=".xlsx"
              onChange={handleFileChange as any}
              className="absolute opacity-0 -z-10"
            />
          </div>
          {data?.payload?.data?.sampleExcelUrl && (
            <p>
              {t("downloadSampleFileExcelPart1")}
              <Link
                href={data?.payload?.data?.sampleExcelUrl}
                target="_blank"
                className="text-primary mx-2"
              >
                {t("downloadSampleFileExcelPart2")}
              </Link>
              {t("downloadSampleFileExcelPart3")}
            </p>
          )}
        </div>
      </div>

      {!!studentTable?.body.length && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-primary text-white">
              <tr>
                {studentTable.head.map((item) => (
                  <th className="p-2" key={item}>
                    {tCommon(item)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {!loading ? (
                studentTable.body.map((row) => (
                  <tr className="[&:not(:last-child)]:border-b" key={uuidv4()}>
                    {row.map((cell) => (
                      <td className="p-2" key={cell}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <td colSpan={6}>
                  <LoadingSnipper />
                </td>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AddListStudents = ({
  onAddStudents,
  students,
  toggleGetDataFromExcel,
  isGetDataFromExcel,
  onChangeFileUpload,
  setStudentsExcel,
}: {
  onAddStudents: (st: Array<StudentType>) => void;
  students: Array<StudentType>;
  toggleGetDataFromExcel: () => void;
  isGetDataFromExcel: boolean;
  onChangeFileUpload: (file: File) => void;
  setStudentsExcel: Dispatch<SetStateAction<any[]>>;
}) => {
  const t = useTranslations("class");

  return (
    <ExcelAddListStudents
      onChangeFileUpload={onChangeFileUpload}
      setStudentsExcel={setStudentsExcel}
    />
  );
};

type StudentType = {
  gender: boolean;
  fullName: string;
};

export default function CreateClassForm() {
  const t = useTranslations("class");
  const tCommon = useTranslations("common");
  const tToastMessage = useTranslations("toastmessage");

  const [students, setStudents] = useState<StudentType[]>([]);
  const [studentsExcel, setStudentsExcel] = useState<any[]>([]);
  const [ListSubject, setListSubject] = useState<
    { label: string; value: string }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGetDataFromExcel, setIsGetDataFromExcel] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File>();
  const router = useRouter();
  const { toast } = useToast();
  const toggleGetDataFromExcel = () => {
    setIsGetDataFromExcel(!isGetDataFromExcel);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await classRequest.getListSubject();
      if (!!data?.length) {
        setListSubject(
          data.map((item: any) => ({
            label: item.name,
            value: String(item.id),
          }))
        );
      }
    };
    fetchData();
  }, []);

  const formSchema = z.object({
    name: z.string().min(1, { message: t("enterClassName") }),
    fullName: z.string(),
    seasonDuration: z
      .object({
        start: z.date(),
        end: z.date(),
      })
      .partial()
      .refine((data) => data.start && data.end, {
        message: tCommon("invalidInput"),
      }),
    subjects: z.array(z.string()),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      fullName: "",
      subjects: [],
      seasonDuration: {
        start: undefined,
        end: undefined,
      },
    },
  });

  const queryClient = useQueryClient();

  const mutationImportExcel = useCreateClassByImportExcel();
  const mutationCreateClassNormal = useCreateClassNormal();

  const handleAddClassNormal = async (values: z.infer<typeof formSchema>) => {
    // Xử lí students nếu từ file excel
    let studentEx = [];
    if (isGetDataFromExcel) {
      studentEx = transformData(studentsExcel);
    }

    if (!students.length && !studentEx.length)
      return setErrorMessage(t("enterStudentList"));

    const { seasonDuration, ...value } = values;
    setErrorMessage("");
    const formattedSeasonDuration = `${format(
      seasonDuration.start || "",
      "MM/yyyy"
    )} - ${format(seasonDuration.end || "", "MM/yyyy")}`;
    const res = await mutationCreateClassNormal.mutateAsync({
      ...values,
      seasonName: "Khóa Chính",
      seasonDuration: formattedSeasonDuration,
      students: isGetDataFromExcel ? studentEx : students,
    });
    if (res.status === 200) {
      toast({
        title: tToastMessage("success"),
        description: t("classCreatedSuccess"),
      });
      queryClient.resetQueries({ queryKey: ["classes"] });
      router.push("/workspace/class");
    } else {
      toast({
        variant: "destructive",
        title: tToastMessage("error"),
        description: t("requiredFieldsError"),
      });
    }
  };

  function transformData(rawData: any) {
    return rawData.map((item: any) => ({
      fullName: item[1],
      nickname: item[2],
      gender: item[3] && item[3].toLowerCase() === "nam",
      parentPhone: item[4],
      group: item[5],
    }));
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    handleAddClassNormal(values);
  }

  const handleAddStudents = (st: Array<StudentType>) => {
    setStudents(st);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex gap-8 ">
          <InputWithLabel
            fieldTitle={`${t(
              "className"
            )} <span class="text-[#F4673D] mb-1 text-sm">*</span>`}
            nameInSchema="name"
            placeholder={`${t("className")}`}
            className="flex-1"
          />
          <InputWithLabel
            fieldTitle={`${t(
              "fullClassName"
            )} <span class="text-[#F4673D] mb-1 text-sm"></span>`}
            nameInSchema="fullName"
            placeholder={t("fullClassName")}
            className="flex-1"
          />
        </div>
        <div className="flex gap-8">
          <FormField
            control={form.control}
            name="seasonDuration"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-1">
                <FormLabel className="text-base font-medium capitalize">
                  {tCommon("classTerm")}
                  <span className="text-[#F4673D] mb-1 text-sm"> *</span>
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
                          `${format(field.value.start, "MM/yyyy")} - ${format(
                            field.value.end,
                            "MM/yyyy"
                          )}`
                        ) : (
                          <span className="capitalize text-[#B5B7C0]">
                            {tCommon("selectClassTerm")}
                          </span>
                        )}
                        <CalendarDaysIcon className="h-5 w-5 text-[#B5B7C0]" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <MonthRangePicker
                      onMonthRangeSelect={(newDates) =>
                        form.setValue("seasonDuration", newDates)
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
          <FormField
            control={form.control}
            name="subjects"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-1">
                <FormLabel className="text-base font-medium capitalize">
                  {tCommon("subjects")}
                </FormLabel>
                <MultiSelect
                  options={ListSubject}
                  onValueChange={(subject) =>
                    form.setValue("subjects", subject)
                  }
                  defaultValue={field.value}
                  placeholder={tCommon("selectSubjects")}
                  variant="inverted"
                  animation={2}
                  maxCount={4}
                  contentClassName="w-[607px]"
                  className="h-[50px]"
                  extraText={tCommon("subject")}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <AddListStudents
          onAddStudents={handleAddStudents}
          students={students}
          toggleGetDataFromExcel={toggleGetDataFromExcel}
          isGetDataFromExcel={isGetDataFromExcel}
          onChangeFileUpload={setSelectedFile}
          setStudentsExcel={setStudentsExcel}
        />
        <Button
          type="submit"
          className="rounded-full p-6 text-lg"
          loading={
            mutationCreateClassNormal.isPending || mutationImportExcel.isPending
          }
        >
          {t("createNewClass")}
        </Button>
        {errorMessage && (
          <p className="text-red-500 font-semibold">{errorMessage}</p>
        )}
      </form>
    </Form>
  );
}
