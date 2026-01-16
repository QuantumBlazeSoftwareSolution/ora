import { getAllStores } from "@/app/actions/admin";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function StoresPage() {
  const stores = await getAllStores();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
          Stores
        </h1>
        <p className="text-muted-foreground">
          Active businesses and their performance.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="bg-muted/50 text-foreground uppercase font-medium text-xs">
            <tr>
              <th className="px-6 py-4">Store Profile</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Subscription</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {stores.map((store) => (
              <tr
                key={store.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">
                    {store.name}
                  </div>
                  <div className="text-xs font-mono text-primary">
                    ora.lk/{store.slug}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-foreground">{store.user?.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {store.user?.email}
                  </div>
                </td>
                <td className="px-6 py-4 capitalize">
                  {store.subscription?.name || "Free"}
                  {store.subscription && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({store.subscription.price} LKR)
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      store.status === "approved"
                        ? "bg-green-500/10 text-green-600"
                        : store.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-600"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {store.status === "approved" ? "Active" : store.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/${store.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    <ExternalLink size={16} className="ml-auto" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
