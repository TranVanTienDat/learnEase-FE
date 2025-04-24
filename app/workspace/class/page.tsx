"use client";
import classRequest from "@/apiRequest/class";
import { removeSessionTokenCookies } from "@/app/actions";
import { LoadingSnipper } from "@/components/LoadingSnipper";
import RemoveClassModal from "@/components/RemoveClassModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useFetchClasses from "@/queryHooks/class/useFetchClasses";
import useGetCalendar from "@/queryHooks/class/useGetCalendar";
import useUserDetailStore from "@/stores/user-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart,
  CalendarCheck2,
  FlagTriangleLeft,
  FlagTriangleRight,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSX, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const headSchedule = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface IScheduleItem {
  endTime: string;
  startTime: string;
  class: string;
  classInfo: {
    name: string;
  };
}

interface IScheduleDaily {
  [day: string]: IScheduleItem[];
}

const ScheduleTable = () => {
  const { data: bodySchedule } = useGetCalendar();
  const t = useTranslations("class");
  return (
    <div className="border rounded-[30px] overflow-auto bg-primary">
      <table className="w-full rounded-t-xl min-w-[800px]">
        <thead className="text-white">
          <tr className="">
            {headSchedule.map((item) => (
              <th className="p-2" key={item}>
                {t(item)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          <tr>
            {bodySchedule &&
              Object.keys(bodySchedule as IScheduleDaily).map((item) => (
                <td className="border p-2 align-top" key={item}>
                  <div className="space-y-2">
                    {(bodySchedule as IScheduleDaily)[item].map((cl) => (
                      <div
                        className="rounded-[30px] border-[3px] border-secondary text-center p-2"
                        key={uuidv4()}
                      >
                        <p className="font-semibold text-lg">
                          {cl.classInfo.name}
                        </p>
                        <p className="text-center">{`${cl.startTime} - ${cl.endTime}`}</p>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

interface IClassItem {
  id: number;
  name: string;
  fullName: string;
  students: {
    count: number;
  };
}

interface IClassItemProps extends IClassItem {
  allowRemove?: boolean;
  allowViewStudent?: boolean;
  allowEdit?: boolean;
  handleRemoveOrLeaveClass: (id: number | string) => void;
}

const ClassItem = ({
  name,
  fullName,
  students,
  id,
  allowRemove,
  allowViewStudent = true,
  allowEdit = true,
  handleRemoveOrLeaveClass,
}: IClassItemProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const t = useTranslations("class");
  const tToastMessage = useTranslations("toastmessage");
  const tCommon = useTranslations("common");

  const handleLeaveClass = async () => {
    if (allowRemove) {
      let text = t("deleteClassConfirmation");
      if (confirm(text) == true) {
        try {
          const res = await classRequest.disconnectClass(id.toString());
          if (res.status === 200) {
            queryClient.resetQueries({ queryKey: ["classesGroup"] });
            toast({
              title: t("deleteClassSuccess"),
            });
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: t("deleteClassFailure"),
          });
        }
      }
    }
  };

  const handleRemoveClass = async () => {
    try {
      queryClient.setQueryData(["classes"], (old: any) => ({
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          data: page.data.filter((item: any) => item.id !== id),
          pageParams: page.pageParams,
          nextCursor: page.nextCursor,
        })),
      }));
      const res = await classRequest.deleteClass(id.toString());
      if (res.status === 200) {
        toast({
          title: t("deleteClassTitle"),
          description: tToastMessage("success"),
        });
      } else {
        toast({
          variant: "destructive",
          title: tToastMessage("error"),
          description: t("deleteClassError"),
        });
      }
    } catch (error) {
      console.log("error", error);
      toast({
        variant: "destructive",
        title: tToastMessage("error"),
        description: t("deleteClassError"),
      });
    }
  };

  return (
    <div className="relative">
      <div className="bg-[#F0F6FA] p-6 text-primary rounded-[30px]">
        <div className="flex justify-start gap-2 items-center text-white mb-3">
          <p className="text-6   font-semibold w-[100px] min-w-[100px] max-w-[100px] h-[100px]  p-2 rounded-full bg-tertiary flex justify-center items-center">
            {name}
          </p>
          <p className=" text-xl font-bold truncate text-primary">{fullName}</p>
        </div>
        <ul className="space-y-3 text-[15px]">
          {allowViewStudent && (
            <li>
              <Link
                href={`/workspace/class/${id}/students`}
                className="flex items-center gap-3 group"
              >
                <span className="rounded-[8px] flex items-center justify-center">
                  <Users className="text-[#0E0D25]" size={20} />
                </span>
                <span className="text-[#0E0D25] group-hover:text-primary font-bold">
                  Danh sách học sinh
                </span>
              </Link>
            </li>
          )}
          <li>
            <Link
              href={`/workspace/class/${id}/attendance`}
              className="flex items-center gap-3 group"
            >
              <span className=" rounded-[8px] flex items-center justify-center">
                <FlagTriangleRight className="text-[#0E0D25]" size={20} />
              </span>
              <span className="text-[#0E0D25] group-hover:text-primary font-bold">
                Điểm danh hằng ngày
              </span>
            </Link>
          </li>
          <li>
            <Link
              href={`/workspace/class/${id}/statistical?key=point`}
              className="flex items-center gap-3 group"
            >
              <span className=" rounded-[8px] flex items-center justify-center">
                <BarChart className="text-[#0E0D25]" size={20} />
              </span>
              <span className="text-[#0E0D25] group-hover:text-primary font-bold">
                Thống kê học tập
              </span>
            </Link>
          </li>
          {allowEdit && (
            <li>
              <Link
                href={`/workspace/class/${id}/edit-class`}
                className="flex items-center gap-3 group"
              >
                <span className="h-[32px] w-[32px] bg-[#E8F4E6] rounded-[8px] flex items-center justify-center">
                  <CalendarCheck2 className="text-[#0E0D25]" size={24} />
                </span>
                <span className="text-[#0E0D25] group-hover:text-primary font-bold">
                  {t("editTimetable")}
                </span>
              </Link>
            </li>
          )}
          {allowRemove && (
            <li>
              <a
                className="flex items-center gap-3 group cursor-pointer"
                onClick={handleLeaveClass}
              >
                <span className="h-[32px] w-[32px] bg-[#FEEFEA] rounded-[8px] flex items-center justify-center">
                  <img src="/images/icons/leave.svg" alt="" />
                </span>
                <span className="text-[#F25B2C] group-hover:text-[#F25B2C] font-medium">
                  {t("leaveClass")}
                </span>
              </a>
            </li>
          )}
        </ul>
        <div className="flex gap-2 mt-6 justify-center">
          {!allowRemove && (
            <RemoveClassModal
              onRemove={handleRemoveClass}
              className="px-8 min-w-[inherit] ml-[inherit]"
              nameButton={tCommon("removeClass")}
            />
          )}
          <Link href={`/workspace/class/${id}`}>
            <Button className=" hover:text-white bg-primary rounded-full p-6 text-white px-8 font-semibold">
              {t("joinClass")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ClassList = () => {
  const t = useTranslations("class");

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useFetchClasses();

  const flattenedData = data?.pages?.flatMap?.((item: any) => item?.data) || [];
  if (flattenedData?.length === 0) return null;

  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-2 h-[480px] overflow-y-auto pr-2.5 table-wrapper">
          {flattenedData.map((item: any) => (
            <ClassItem key={item.id} {...item} />
          ))}
        </div>
        <div className="flex justify-center py-[10px]">
          {hasNextPage ? (
            <div className="flex justify-center py-[10px]">
              <Button
                variant="link"
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
              >
                {isFetchingNextPage
                  ? t("loadingMore")
                  : hasNextPage
                  ? t("loadMore")
                  : null}
              </Button>
              <div>
                {isFetching && !isFetchingNextPage ? "Fetching..." : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// const ClassesGroup = () => {
//   const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
//     useFetchClasses();
//   const flattenedData = data?.pages?.flatMap?.((item: any) => item?.data) || [];
//   const t = useTranslations("class");
//   if (flattenedData?.length === 0) return null;
//   return (
//     <>
//       <div className="mt-10">
//         <h2 className="text-[40px] md:text-[60px] text-center font-semibold py-4">
//           {t("coClass")}
//         </h2>
//         <div className="  border-[2px]  px-2 rounded-[20px]">
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 my-2 px-2 h-[480px] overflow-y-auto">
//             {flattenedData.map(
//               (item: JSX.IntrinsicAttributes & IClassItemProps) => (
//                 <ClassItem
//                   key={item.id}
//                   {...item}
//                   allowRemove
//                   allowEdit={false}
//                   allowViewStudent={false}
//                 />
//               )
//             )}
//           </div>
//           {hasNextPage ? (
//             <div className="flex justify-center py-[10px]">
//               <Button
//                 variant="link"
//                 onClick={() => fetchNextPage()}
//                 disabled={!hasNextPage || isFetchingNextPage}
//               >
//                 {isFetchingNextPage
//                   ? t("loadingMore")
//                   : hasNextPage
//                   ? t("loadMore")
//                   : null}
//               </Button>
//               <div>
//                 {isFetching && !isFetchingNextPage ? "Fetching..." : null}
//               </div>
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </>
//   );
// };

export default function Class() {
  const t = useTranslations("class");
  const userDetail = useUserDetailStore((state) => state.user);
  const router = useRouter();
  const logout = async () => {
    await removeSessionTokenCookies();
    localStorage.removeItem("sessionToken");
    router.push("/");
  };

  useEffect(() => {
    const sessionToken = localStorage?.getItem("sessionToken");
    if (!userDetail?.id && !sessionToken) {
      logout();
    }
  }, [userDetail?.id]);

  return (
    <main className="container relative">
      <div className="absolute right-[30px] top-[-44px] flex gap-2 justify-center text-sm text-primary underline">
        <Link href="/workspace/class/create">{t("addClass")}</Link>
        <Link href="/workspace/class/config">Phiếu điểm</Link>
      </div>
      <div className="lg:px-10 pb-10 ">
        <ScheduleTable />

        <h1 className="text-[40px] md:text-[60px] text-center font-semibold py-4">
          Danh sách lớp học
        </h1>
        <ClassList />
      </div>
    </main>
  );
}
