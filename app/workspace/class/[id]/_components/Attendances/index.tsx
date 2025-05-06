"use client";
import DatePicker from "@/app/workspace/class/[id]/_components/Attendances/DatePicker";
import StudentItem from "@/app/workspace/class/[id]/_components/Attendances/StudentItem";
import THeadItem from "@/app/workspace/class/[id]/_components/Attendances/THeadItem";
import BackTitle from "@/components/BackTitle";
import { Button } from "@/components/ui/button";
import useSortAttendance from "@/hooks/attendance/useSortAttendance";
import useModals from "@/hooks/useModals";
import useSaveAttendance from "@/queryHooks/class/useSaveAttendance";
import {
  AttendanceStudentParams,
  AttendanceStudentType,
  HeadItemType,
  SaveAttendanceParamsType,
  SortType,
} from "@/types/attendance";
import clsx from "clsx";
import { isToday } from "date-fns";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import CommentModal from "@/app/workspace/class/[id]/_components//Attendances/CommentModal";
import useActiveStudentComment from "@/hooks/comment/useActiveStudentComment";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import studentRequest, { StudentType } from "@/apiRequest/students";
import EditStudentModal from "@/app/workspace/class/[id]/_components/EditStudentModal";
import { LoadingSnipper } from "@/components/LoadingSnipper";
import { useTranslations } from "next-intl";
import useUserDetailStore from "@/stores/user-store";

export default function Attendances({
  classData,
  students: defaultStudents,
  searchParams,
}: {
  students: AttendanceStudentType[];
  classData: {
    name: string;
    id: string;
    teacherUid: string;
  };
  searchParams: any;
}) {
  const t = useTranslations("attendance");
  const tCommon = useTranslations("common");
  const tToastMessage = useTranslations("toastmessage");
  const { sort, onSort } = useSortAttendance();
  const [isDisableSaveAttendance, setIsDisableSaveAttendance] = useState(true);
  const { activeStudent, handleActiveStudentComment } =
    useActiveStudentComment();
  const { toggle, modal: ModalComment, isOpen } = useModals();
  const [isAttendanceAll, setIsAttendanceAll] = useState(
    defaultStudents.every((student) => student.dailyRecord?.attendance === true)
  );
  const [students, setStudents] = useState(defaultStudents);
  const [isLoading, setIsLoading] = useState(true);
  const [dataModal, setDataModal] = useState<StudentType>();
  const { toggle: toggleEdit, modal } = useModals();
  const { toast } = useToast();
  const router = useRouter();
  const mutationAttendance = useSaveAttendance();
  const user = useUserDetailStore((state) => state.user);
  const isPermission = user?.uid == classData.teacherUid;

  const tHeads: HeadItemType[] = [
    {
      className: "w-[40px]",
      subRows: [
        {
          title: {
            label: "order",
            value: "stt",
          },
          disabled: true,
          [SortType.DESC]: () => {},
          [SortType.ASC]: () => {},
        },
      ],
    },
    {
      subRows: [
        {
          title: {
            label: "fullName",
            value: "name",
          },
          [SortType.DESC]: () => handleSortName(SortType.DESC),
          [SortType.ASC]: () => handleSortName(SortType.ASC),
        },
      ],
    },
    {
      subRows: [
        {
          title: {
            label: "attendance",
            value: "attendance",
          },
          disabled: true,
          [SortType.DESC]: () => {},
          [SortType.ASC]: () => {},
        },
      ],
    },
    {
      subRows: [
        {
          title: {
            label: "totalPoints",
            value: "totalExtra",
          },
          [SortType.DESC]: () => handleSortPointTotal(SortType.DESC),
          [SortType.ASC]: () => handleSortPointTotal(SortType.ASC),
        },
      ],
    },
    {
      subRows: [
        {
          title: {
            label: "thisMonth",
            value: "monthExtraAndMinus",
          },
          [SortType.DESC]: () => handleSortTotal(SortType.DESC, "monthPoint"),
          [SortType.ASC]: () => handleSortTotal(SortType.ASC, "monthPoint"),
        },
      ],
    },
    {
      subRows: [
        {
          title: {
            label: "thisWeek",
            value: "weekExtraAndMinus",
          },
          [SortType.DESC]: () => handleSortTotal(SortType.DESC, "weekPoint"),
          [SortType.ASC]: () => handleSortTotal(SortType.ASC, "weekPoint"),
        },
      ],
    },
    {
      subRows: [
        {
          title: {
            label: "today",
            value: "dayExtraAndMinus",
          },
          [SortType.DESC]: () => handleSortTotal(SortType.DESC, "dayPoint"),
          [SortType.ASC]: () => handleSortTotal(SortType.ASC, "dayPoint"),
        },
      ],
    },
    {
      className: "w-[252px]",
      subRows: [
        {
          title: {
            label: "comments",
            value: "comment",
          },
          disabled: true,
          [SortType.DESC]: () => {},
          [SortType.ASC]: () => {},
        },
      ],
    },
  ];

  const handleReFetchList = (item: StudentType) => {
    setStudents((prev) => {
      return prev.map((student) => {
        if (parseInt(student.id) === item.id) {
          return {
            ...student,
            nickname: item.nickname,
            fullName: item.fullName,
            code: item.code,
          };
        }
        return student;
      });
    });
  };

  const handleEdit = async (id: string) => {
    if (isPermission) {
      const data = await studentRequest.getStudentDetail(id);
      if (data) {
        setDataModal(data);
        toggleEdit();
      }
    } else {
      toast({
        variant: "destructive",
        title: tToastMessage("notAuthorized"),
        description: tToastMessage("desNotAuthorizedEdit"),
      });
    }
  };

  const handleSaveAttendance = async () => {
    let params = students.map((x) => ({
      studentId: x.id,
      comment: x.dailyRecord.comment,
    }));
    if (isToday(searchParams))
      params = students.map((x) => ({
        studentId: x.id,
        attendance: x.dailyRecord.attendance == true ? true : false,
        comment: x.dailyRecord.comment,
      }));

    const result = await mutationAttendance.mutateAsync({
      classId: classData.id,
      params,
      date: searchParams,
    });

    if (result?.status === 200) {
      toast({
        title: tToastMessage("success"),
        description: t("attendanceSaveSuccess"),
      });
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: tToastMessage("error"),
        description: t("attendanceSaveError"),
      });
    }
  };

  const handleAttendanceStudent = useCallback(
    async (params: AttendanceStudentParams, isComment?: boolean) => {
      if (params) {
        setIsLoading(false);
        const { id, field, value } = params;
        let dataComment: SaveAttendanceParamsType[] = [
          {
            studentId: id,
            comment: value?.toString(),
          },
        ];
        setStudents((prev) => {
          const index = prev.findIndex((x) => x.id === id);
          const newStudents = [...prev];
          newStudents[index] = {
            ...newStudents[index],
            dailyRecord: {
              ...newStudents[index].dailyRecord,
              [field]: value,
            },
          };
          return newStudents;
        });
        if (isComment) {
          const result = await mutationAttendance.mutateAsync({
            classId: classData.id,
            params: dataComment,
            date: searchParams,
          });

          if (result?.status === 200) {
            toast({
              title: tToastMessage("success"),
              description: t("commentSaveSuccess"),
            });
            router.refresh();
          } else {
            toast({
              variant: "destructive",
              title: tToastMessage("error"),
              description: t("commentSaveError"),
            });
          }
        } else {
          if (isDisableSaveAttendance) setIsDisableSaveAttendance(false);
        }
        setIsLoading(true);
      }
    },
    []
  );

  const handleSortPointTotal = (type: `${SortType}`) => {
    const newStudents = [...students];
    newStudents.sort((a, b) => {
      const totalA = +a.point.extraPoint - +a.point.minusPoint;
      const totalB = +b.point.extraPoint - +b.point.minusPoint;
      return type === SortType.ASC ? totalB - totalA : totalA - totalB;
    });
    setStudents(newStudents);
  };

  const handleSortName = (type: `${SortType}`) => {
    const newStudents = [...students];
    newStudents.sort((a, b) => {
      return type === SortType.ASC
        ? a.nickname.localeCompare(b.nickname)
        : b.nickname.localeCompare(a.nickname);
    });
    setStudents(newStudents);
  };

  const handleSortTotal = (
    type: `${SortType}`,
    field: "monthPoint" | "weekPoint" | "dayPoint"
  ) => {
    const newStudents = [...students];
    newStudents.sort((a, b) => {
      const totalA = +a[field].extra - +a[field].minus;
      const totalB = +b[field].extra - +b[field].minus;
      return type === SortType.ASC ? totalB - totalA : totalA - totalB;
    });
    setStudents(newStudents);
  };

  const top3Point = useMemo(() => {
    const newStudents = students;
    const top3Students = newStudents
      .sort((a, b) => {
        const totalA = +a.point.extraPoint - +a.point.minusPoint;
        const totalB = +b.point.extraPoint - +b.point.minusPoint;
        return totalB - totalA;
      })
      .slice(0, 3)
      .map((student) => student.id);
    return {
      [top3Students[0]]: "1",
      [top3Students[1]]: "2",
      [top3Students[2]]: "3",
    };
  }, []);

  const handleToggleAttendanceAll = () => {
    if (!isToday(searchParams || new Date())) return;

    const updatedAttendance = students.map((student) => ({
      ...student,
      dailyRecord: student.dailyRecord
        ? { ...student.dailyRecord, attendance: !isAttendanceAll }
        : student.dailyRecord,
    }));

    setStudents(updatedAttendance);
    setIsDisableSaveAttendance(false);
    setIsAttendanceAll((prev) => !prev);
  };

  const handleRemoveStudent = async (id: string) => {
    try {
      if (id) {
        const res = await studentRequest.deleteStudent(id);
        if (res.status === 200) {
          router.refresh();
          toggleEdit();
          toast({
            title: tCommon("titleDeleteStudent"),
            description: tToastMessage("success"),
          });
        } else {
          toast({
            variant: "destructive",
            title: tToastMessage("error"),
            description: tToastMessage("desErrorDelete"),
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: tToastMessage("success"),
        description: tToastMessage("desErrorDelete"),
      });
    }
  };

  return (
    <>
      {dataModal && (
        <EditStudentModal
          modal={modal}
          toggle={toggleEdit}
          initValue={dataModal}
          onReFetchList={handleReFetchList}
          handleRemoveStudent={handleRemoveStudent}
          isPermission={isPermission}
          enableRemove
        />
      )}
      <div className="space-y-5 pb-5  min-h-[calc(100vh-310px)]">
        <div className="flex gap-4 justify-between items-center">
          <BackTitle url={`/workspace/class/${classData.id}`}>
            <h1 className="capitalize text-[32px] font-bold">
              {t("dailyAttendanceClass")} {classData.name}
            </h1>
          </BackTitle>
          <Button
            onClick={handleSaveAttendance}
            className={clsx(
              "min-w-[160px] rounded-full p-2 font-medium text-md",
              {
                "text-[#b5b7c0] bg-[#e7e8eb] !opacity-100":
                  isDisableSaveAttendance,
              }
            )}
            disabled={isDisableSaveAttendance || mutationAttendance.isPending}
          >
            {mutationAttendance.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("saveAttendance")}
          </Button>
        </div>
        <DatePicker
          idClass={classData.id}
          setIsLoading={setIsLoading}
          isAttendanceAll={isAttendanceAll}
          handleToggle={handleToggleAttendanceAll}
          isDisableAttendance={!isToday(searchParams || new Date())}
        />
        {isLoading ? (
          <div className="border rounded-[20px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary">
                <tr className="">
                  {tHeads.map((item) => (
                    <THeadItem
                      key={item.subRows[0].title.value}
                      subRows={item.subRows}
                      activeSort={sort}
                      onChange={onSort}
                      className={item.className}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((x, index) => (
                  <StudentItem
                    key={x.id}
                    {...x}
                    date={searchParams}
                    nickname={x.nickname || x.fullName}
                    stt={index + 1}
                    isDisableAttendance={!isToday(searchParams || new Date())}
                    onChangeStudent={handleAttendanceStudent}
                    classId={classData.id}
                    rank={top3Point[x.id] as "1" | "2" | "3"}
                    onToggleComment={toggle}
                    handleActiveStudentComment={handleActiveStudentComment}
                    handleEdit={handleEdit}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <LoadingSnipper />
        )}

        <div className="flex gap-4">
          <Link href={`/workspace/class/${classData.id}`}>
            <Button className="rounded-full p-2 px-8 font-medium text-md">
              {tCommon("joinClass")}
            </Button>
          </Link>
        </div>
      </div>
      <ModalComment
        classNameContent="sm:rounded-[20px] max-w-[550px] h-[352px] gap-y-10"
        title={t("addComment")}
      >
        <CommentModal
          initValue={activeStudent}
          handleSave={(params) => handleAttendanceStudent(params, true)}
        />
      </ModalComment>
    </>
  );
}
