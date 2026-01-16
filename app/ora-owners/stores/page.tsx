import { getAllStores } from "@/app/actions/admin";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function StoresPage() {
  const stores = await getAllStores();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Stores</h1>
        <p className="text-neutral-400">
          Active businesses and their performance.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-neutral-950/50 text-neutral-200 uppercase font-medium text-xs">
            <tr>
              <th className="px-6 py-4">Store Profile</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Subscription</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {stores.map((store) => (
              <tr
                key={store.id}
                className="hover:bg-neutral-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{store.name}</div>
                  <div className="text-xs font-mono text-blue-400">
                    ora.lk/{store.slug}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-white">{store.user?.name}</div>
                  <div className="text-xs">{store.user?.email}</div>
                </td>
                <td className="px-6 py-4 capitalize">
                  {store.subscription?.name || "Free"}
                  {store.subscription && (
                    <span className="ml-2 text-xs text-neutral-500">
                      ({store.subscription.price} LKR)
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      store.status === "approved"
                        ? "bg-green-500/10 text-green-500"
                        : store.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {store.status === "approved" ? "Active" : store.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/${store.slug}`}
                    className="hover:text-white transition-colors"
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
