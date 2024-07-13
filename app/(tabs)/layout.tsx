import TabBar from "@/components/tab-bar";

export default function TabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <TabBar />
      {children}
    </div>
  );
}