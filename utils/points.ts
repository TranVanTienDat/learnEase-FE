import { el } from "date-fns/locale";

export const calculateAverage = ({
  points,
  grandingBreakdowns,
  student: item,
  subjectId,
}: {
  points: any[];
  grandingBreakdowns: any[];
  student: any;
  subjectId: string;
}) => {
  const grandingTotal = grandingBreakdowns?.reduce(
    (accumulator: any, grand: any) => {
      return accumulator + +grand.coefficient;
    },
    0
  );
  const average = grandingBreakdowns
    ?.reduce((act: any, cur: any) => {
      const pointGranding = points.find(
        (p) =>
          p.student.id == item?.id &&
          p.subject?.id == subjectId &&
          p.grandingBreakdown?.id == cur.id
      );
      const score =
        (pointGranding?.score * cur.coefficient || 0) / grandingTotal;
      return act + score;
    }, 0)
    .toFixed(1);
  return average;
};

export const convertAbility = (point: number): string => {
  if (point >= 9) return "Outstanding";
  if (point >= 8) return "excellent";
  if (point >= 7) return "good";
  if (point >= 6) return "average";
  if (point >= 5) return "poor";
  return "fail";
};
