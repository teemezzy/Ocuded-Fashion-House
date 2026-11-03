export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-[24px] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#A85D34,#7E4526_62%,#3F2413)]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgba(214,168,116,0.25),rgba(214,168,116,0)_70%)]" />
      <div className="relative w-full max-w-[420px]">{children}</div>
    </div>
  );
}
