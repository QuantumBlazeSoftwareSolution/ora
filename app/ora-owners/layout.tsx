export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-rose-500/30">
      {children}
    </div>
  );
}
