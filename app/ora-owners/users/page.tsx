import { getAllUsers } from "@/app/actions/admin";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          User Base
        </h1>
        <p className="text-neutral-400">
          All registered accounts on the platform.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-neutral-950/50 text-neutral-200 uppercase font-medium text-xs">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-neutral-800/50 transition-colors"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <Avatar className="h-8 w-8 bg-neutral-800 border border-neutral-700">
                    <AvatarFallback className="text-xs">
                      {user.name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-white">
                      {user.name || "Unknown"}
                    </div>
                    <div className="text-xs">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-rose-500/10 text-rose-500"
                        : user.role === "merchant"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-neutral-500/10 text-neutral-500"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 text-right font-mono text-xs opacity-50">
                  {user.id.slice(0, 8)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
