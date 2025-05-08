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

const genders = [1, 0];

const GenderItem = ({
  value,
  onChange,
  index,
}: {
  value: boolean;
  onChange: ({ index, value }: { index: number; value: boolean }) => void;
  index: number;
}) => {
  const tCommon = useTranslations("common");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center  gap-2">
          <span className="min-w-[36px] text-left">
            {value ? tCommon("male") : tCommon("female")}
          </span>
          <FontAwesomeIcon icon={faAngleDown} className="" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[92px] rounded-lg">
        {genders.map((item) => (
          <DropdownMenuItem
            key={item}
            onClick={() => onChange({ index, value: !!item })}
            className="cursor-pointer"
          >
            <DropdownMenuLabel>
              {item ? tCommon("male") : tCommon("female")}
            </DropdownMenuLabel>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NormalAddListStudents = ({
  onAddStudents,
  students,
}: {
  onAddStudents: (st: Array<StudentType>) => void;
  students: Array<StudentType>;
}) => {
  const t = useTranslations("class");
  const tCommon = useTranslations("common");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const handleAddList = () => {
    if (textAreaRef.current) {
      const newStudents = textAreaRef.current.value;
      if (!newStudents) return;
      const splitValues: Array<StudentType> = newStudents
        .split("\n")
        .filter((item: string) => item.trim())
        .map((item: string) => ({
          fullName: item,
          gender: true,
        }));
      onAddStudents([...students, ...splitValues]);
      textAreaRef.current.value = "";
    }
  };

  const handleChangeGender = ({
    index,
    value,
  }: {
    index: number;
    value: boolean;
  }) => {
    const newStudents = [...students];
    const studentNeedChange = newStudents[index - 1];
    studentNeedChange.gender = value;
    onAddStudents(newStudents);
  };

  const handleRemove = (index: number) => {
    const newStudents = [...students];
    newStudents.splice(index - 1, 1);
    onAddStudents(newStudents);
  };

  return (
    <>
      <div className="flex gap-8">
        <div className="flex-1 relative h-[292px]">
          <Textarea
            className="text-lg h-full pb-[66px]"
            placeholder={t("enterStudentName")}
            ref={textAreaRef}
          />
          <div className="absolute bottom-[1px] left-[1px] px-[10px] right-[1px] text-center bg-white rounded-sm">
            <div className="border-t py-[10px]">
              <a
                className="border border-primary rounded-full text-primary p-4 py-2 inline-block cursor-pointer"
                onClick={handleAddList}
              >
                {t("listAddition")}
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-2 flex-1">
          {!!students.length && (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="p-2 w-[60px] text-center">
                      {tCommon("order")}
                    </th>
                    <th className="p-2">{tCommon("nameStudent")}</th>
                    <th className="p-2 w-[120px]">{tCommon("gender")}</th>
                    <th className="p-2 w-[60px]"></th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {students.map((st, index) => (
                    <tr
                      key={uuidv4()}
                      className="[&:not(:last-child)]:border-b"
                    >
                      <td className="p-2 text-center">{index + 1}</td>
                      <td className="p-2">{st.fullName}</td>
                      <td className="p-2">
                        <GenderItem
                          value={st.gender}
                          index={index + 1}
                          onChange={handleChangeGender}
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          className="p-0 py-2"
                          onClick={() => handleRemove(index + 1)}
                        >
                          <img src="/images/remove.svg" alt="remove" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* <SubjectSelectMulti /> */}
      </div>
    </>
  );
};

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
          <div className="relative">
            <label
              htmlFor="fileInput"
              className="cursor-pointer text-primary bg-white border border-primary p-2 px-4 rounded-full text-lg inline-block"
            >
              {t("selectFileXlsx")}
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
        <div className="flex-1" />
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
    <>
      <div className="space-y-4 relative flex gap-8">
        <div className="flex-1 flex justify-between">
          <label className="font-medium">
            {t("studentList")}
            <span className="text-[#F4673D] mb-1 ml-1 text-sm">
              * {t("oneNamePerLine")}
            </span>
          </label>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isEditInfo"
              className="w-6 h-6 bg-slate-300 border-0"
              onClick={toggleGetDataFromExcel}
              checked={isGetDataFromExcel}
            />
            <label
              htmlFor="isEditInfo"
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {t("getExcel")}
            </label>
          </div>
        </div>
        <div className="flex-1" />
      </div>
      {isGetDataFromExcel ? (
        <ExcelAddListStudents
          onChangeFileUpload={onChangeFileUpload}
          setStudentsExcel={setStudentsExcel}
        />
      ) : (
        <NormalAddListStudents
          onAddStudents={onAddStudents}
          students={students}
        />
      )}
    </>
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
  console.log("students", students);
  const [ListSubject, setListSubject] = useState<
    { label: string; value: string }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGetDataFromExcel, setIsGetDataFromExcel] = useState(false);
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
    seasonName: z.string().min(1, { message: t("enterClassCourse") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      fullName: "",
      subjects: [],
      seasonName: "",
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
            )} <span class="text-[#F4673D] mb-1 text-sm">* ${t(
              "shortNameExample"
            )} </span>`}
            nameInSchema="name"
            placeholder={`${t("className")}`}
            className="flex-1"
          />
          <InputWithLabel
            fieldTitle={`${t(
              "fullClassName"
            )} <span class="text-[#F4673D] mb-1 text-sm">${t(
              "shortFullNameExample"
            )}</span>`}
            nameInSchema="fullName"
            placeholder={t("fullClassName")}
            className="flex-1"
          />
        </div>
        <div className="flex gap-8">
          <div className="flex gap-[12px]   flex-1">
            <InputWithLabel
              fieldTitle={`${t(
                "course"
              )} <span class="text-[#F4673D] mb-1 text-sm">*</span>`}
              nameInSchema="seasonName"
              placeholder={`${t("nameCourse")}`}
              className="flex-1"
            />

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
          </div>
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
