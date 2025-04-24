import WorkSpaceFooter from "@/app/workspace/_components/WorkSpaceFooter";
import WorkSpaceHeader from "@/app/workspace/_components/WorkSpaceHeader";
import Breadcrumb from "@/components/BreadCrumb";
import { LoadingSnipper } from "@/components/LoadingSnipper";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("common");
  return (
    <div>
      <WorkSpaceHeader />
      <Suspense
        fallback={
          <p className="pt-[80px] lg:pt-[118px] min-h-[calc(100vh-130px-152px)] container text-[72px] font-bold">
            <LoadingSnipper className="min-h-[450px]" />
          </p>
        }
      >
        <div className="pt-[80px] lg:pt-[118px] container">
          <Breadcrumb
            homeElement={t("home")}
            separator={
              <span>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-[11px]"
                />
              </span>
            }
          />
        </div>
        <div className="min-h-[385px]">{children}</div>
      </Suspense>
      <WorkSpaceFooter />
    </div>
  );
}
