import classRequest from "@/apiRequest/class";
import { convertTime } from "@/utils";
import { useQuery } from "@tanstack/react-query";

const useGetCalendar = () => {
  return useQuery({
    queryKey: ["class-calendar"],
    queryFn: async () => {
      const res = await classRequest.getCalendar();
      if (res.status === 200) {
        if (res.payload.data.length === 0) return {};
        const convertedData = res.payload.data.reduce((acc: any, curr: any) => {
          const { day, classInfo, id, ...rest } = curr;

          if (!acc[day]) {
            acc[day] = [];
          }

          acc[day].push({
            startTime: convertTime(rest.startTime),
            endTime: convertTime(rest.endTime),
            id,
            classInfo,
          });

          return acc;
        }, {});

        const daysOfWeek = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];

        const fullWeekSchedule = daysOfWeek.reduce((acc: any, day) => {
          acc[day] = convertedData[day] || [];
          return acc;
        }, {});

        return fullWeekSchedule;
      }
    },
  });
};

export default useGetCalendar;
