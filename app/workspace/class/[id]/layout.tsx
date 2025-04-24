import GivePointModal from "@/components/GivePointModal";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <>
      <GivePointModal defaultClassId={params.id} />
      {children}
    </>
  );
}
