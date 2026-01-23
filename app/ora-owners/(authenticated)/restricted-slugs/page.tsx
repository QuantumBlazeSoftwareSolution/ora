import { getRestrictedSlugs } from "@/app/actions/restricted-slugs";
import { RestrictedSlugManager } from "@/components/admin/RestrictedSlugManager";
import { ShieldAlert } from "lucide-react";

export default async function RestrictedSlugsPage() {
  const slugs = await getRestrictedSlugs();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Restricted Slugs
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage reserved words that cannot be used as store URLs.
          </p>
        </div>
      </div>

      <RestrictedSlugManager initialSlugs={slugs} />
    </div>
  );
}
