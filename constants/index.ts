import path from "path";
import { z } from "zod";

export const formAddStudentSchema = z.object({
  nickname: z.string().optional(),
  fullName: z.string().min(1, { message: "Vui lòng nhập họ tên" }),
  gender: z.enum(["1", "0"], { message: "Vui lòng chọn giới tính" }),
  code: z
    .string()
    .regex(/^OLP-(\d{6})?$/, {
      message: "Mã code phải có định dạng OLP-xxxxxx, trong đó x là chữ số",
    })
    .optional(),
  parentPhone: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .regex(/^\d+$/, { message: "Số điện thoại không hợp lệ" })
      .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
        message: "Số điện thoại không hợp lệ",
      })
      .optional()
  ),
  parentName: z.string().optional(),
  group: z.string().optional(),
  note: z.string().optional(),
  birthday: z.date().optional(),
});

export const formEditStudentSchema = z.object({
  nickname: z.string().min(1, { message: "Vui lòng nhập tên học sinh" }),
  fullName: z.string().optional(),
  gender: z.string(),
  code: z.string().min(1, { message: "Vui lòng nhập mã học sinh" }),
  parentPhone: z
    .string()
    .min(10, { message: "Số điện thoại phải là 10 hoặc 11 chữ số" })
    .max(11, { message: "Số điện thoại phải là 10 hoặc 11 chữ số" })
    .optional(),
  parentName: z.string().optional(),
  note: z.string().optional(),
  birthday: z.date().optional(),
});

export const MAX_NUMBER_STUDENTS_PER_CLASS = 1000;

export const CLASS_PATH = "/workspace/class";

export const TOOLS_PATH = {
  LUCKY_WHEEL: {
    name: "luckyWheel",
    path: "lucky-wheel",
  },
  NAME_PICKER: {
    name: "callOne",
    path: "name-picker",
  },
  NAME_PICKER_N: {
    name: "callMultiple",
    path: "name-picker-n",
  },
  GROUP_GENERATOR: {
    name: "divideGroup",
    path: "group-generator",
  },
  RACE: {
    name: "race",
    path: "bee-race",
  },
  CLICK_TIME: {
    name: "stopwatch",
    path: "click-time",
  },
  DIAGRAM: {
    name: "diagramClass",
    path: "diagram-class",
  },
  GROUP: {
    name: "groupLong",
    path: "group",
  },
};
