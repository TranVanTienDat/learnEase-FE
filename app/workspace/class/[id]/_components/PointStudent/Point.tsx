export default function Point({
  extraPoint,
  minusPoint,
  totalPoint,
}: {
  extraPoint: number;
  minusPoint: number;
  totalPoint: number;
}) {
  return (
    <div className="flex flex-1 font-semibold gap-4 justify-center">
      <p className="text-primary flex items-center justify-center">
        +{extraPoint}
      </p>
      <p className="text-quaternary flex items-center justify-center">
        -{minusPoint}
      </p>
      <p className="rounded-full w-8 h-8 bg-[#e8f4e6] flex items-center justify-center text-[#0a3e00]">
        {totalPoint}
      </p>
    </div>
  );
}

export const PointAttendance = ({
  extraPoint,
  minusPoint,
}: {
  extraPoint: number;
  minusPoint: number;
}) => {
  return (
    <div className="flex font-semibold gap-4 justify-center">
      <p className="text-white flex items-center justify-center min-w-[35px] min-h-[35px] bg-primary rounded-[50%]">
        {extraPoint}
      </p>
      <p className="text-white flex items-center justify-center min-w-[35px] min-h-[35px] bg-quaternary rounded-[50%]">
        {minusPoint}
      </p>
    </div>
  );
};
