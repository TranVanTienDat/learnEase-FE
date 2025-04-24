type AcademicRating =
  | "Xuất Sắc"
  | "Giỏi"
  | "Khá"
  | "Trung Bình"
  | "Yếu"
  | "Kém";
export const convertAcademicRating = (ac: AcademicRating) => {
  if (ac === "Xuất Sắc") return "Outstanding";
  if (ac === "Giỏi") return "excellent";
  if (ac === "Khá") return "goodAcademicPerformance";
  if (ac === "Trung Bình") return "average";
  if (ac === "Yếu") return "poor";
  if (ac === "Kém") return "fail";
  return "null";
};

type Conduct = "Tốt" | "Khá" | "Trung Bình" | "Yếu";

export const convertConduct = (ac: Conduct) => {
  if (ac === "Tốt") return "good";
  if (ac === "Khá") return "fair";
  if (ac === "Trung Bình") return "average";
  if (ac === "Yếu") return "poor";
  return "null";
};
