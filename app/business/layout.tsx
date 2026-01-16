import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "merchant") {
    // If checking specifically for merchant role in broader layout
    // redirect("/business/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark font-sans selection:bg-primary/20">
      {/* Could add a sidebar here if common for all business pages */}
      {children}
    </div>
  );
}
