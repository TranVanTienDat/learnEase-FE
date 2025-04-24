import { SemesterEnum } from "@/constants/statistical";
import { customFormatDate } from "@/utils";
import { differenceInDays, formatDate, parse, subDays } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const usePickDatePointStudents = ({ idClass }: { idClass: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("month") || formatDate(new Date(), "yyyy-MM");
  const parsedDate = parse(date, "yyyy-MM", new Date());
  const handleFilterDate = (date: Date) => {
    const formattedMonth = formatDate(date, "yyyy-MM");
    router.replace(
      `/workspace/class/${idClass}/statistical?key=point&month=${formattedMonth}`
    );
  };

  return {
    handleFilterDate,
    date: parsedDate,
  };
};

export const usePickStatisticalStudy = ({ idClass }: { idClass: string }) => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const searchParams = useSearchParams();
  const semester = searchParams.get("semester") || SemesterEnum.semester1;
  const year = searchParams.get("year") || String(currentYear);
  const handleFilterStatisticalStudy = ({
    semester = SemesterEnum.semester1,
    year = String(currentYear),
  }: {
    semester?: SemesterEnum;
    year?: string;
  }) => {
    router.replace(
      `/workspace/class/${idClass}/statistical?key=study&semester=${semester}&year=${year}`
    );
  };

  return {
    handleFilterStatisticalStudy,
    semester,
    year,
  };
};

// export const usePickDateAttendanceStudents = ({
//   idClass,
// }: {
//   idClass: string;
// }) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const date1 = searchParams.get("date1");
//   const date2 = searchParams.get("date2");
//   const from = date1 && new Date(date1);
//   const to = date2 && new Date(date2);

//   const [isCheckSpace, setIsCheckSpace] = useState(false);

//   const handleFilterDate = (
//     date:
//       | {
//           from: Date | undefined;
//           to?: Date | undefined;
//         }
//       | undefined
//   ) => {
//     let shouldCheckSpace = false;
//     if (date?.from && date?.to) {
//       const daysDifference = differenceInDays(date.to, date.from);
//       shouldCheckSpace = daysDifference > 10;
//       setIsCheckSpace(shouldCheckSpace);
//     }

//     const from = date?.from ? customFormatDate(date.from) : "";
//     const to = date?.to ? customFormatDate(date.to) : "";

//     if (!shouldCheckSpace && date?.from && date?.to) {
//       router.replace(
//         `/workspace/class/${idClass}/statistical?key=attendance&date1=${from}&date2=${to}`
//       );
//     }
//   };

//   return {
//     handleFilterDate,
//     date: { from, to },
//     isCheckSpace,
//   };
// };

export const usePickDateAttendanceStudents = ({
  idClass,
}: {
  idClass: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date1 = searchParams.get("date1");
  const date2 = searchParams.get("date2");
  const from = date1 ? new Date(date1) : undefined;
  const to = date2 ? new Date(date2) : undefined;

  const [isCheckSpace, setIsCheckSpace] = useState(false);

  const handleFilterDate = (date?: { from?: Date; to?: Date }) => {
    if (!date?.from || !date?.to) return;

    const daysDifference = differenceInDays(date.to, date.from);
    const shouldCheckSpace = daysDifference > 10;
    setIsCheckSpace(shouldCheckSpace);

    if (!shouldCheckSpace) {
      const formattedFrom = customFormatDate(date.from);
      const formattedTo = customFormatDate(date.to);
      router.replace(
        `/workspace/class/${idClass}/statistical?key=attendance&date1=${formattedFrom}&date2=${formattedTo}`
      );
    }
  };

  return {
    handleFilterDate,
    date: { from, to },
    isCheckSpace,
  };
};
