import { Suspense } from "react";
import WorkSpaceHeader from "@/app/workspace/_components/WorkSpaceHeader";
import WorkSpaceFooter from "@/app/workspace/_components/WorkSpaceFooter";
import { LoadingSnipper } from "@/components/LoadingSnipper";

export default function WorkSpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <WorkSpaceHeader />
      <Suspense fallback={<LoadingSnipper className="min-h-[605px]" />}>
        {children}
      </Suspense>
      <WorkSpaceFooter />
    </div>
  );
}
