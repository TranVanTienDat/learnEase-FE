import ClassPhoneForm from "@/app/study-tracking/_components/ClassPhoneForm";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <ClassPhoneForm searchParams={searchParams} />;
}
