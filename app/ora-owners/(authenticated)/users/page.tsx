import { getAllUsers } from "@/app/actions/admin";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
          User Base
        </h1>
        <p className="text-muted-foreground">
          All registered accounts on the platform.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="bg-muted/50 text-foreground uppercase font-medium text-xs">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarFallback className="text-xs bg-muted text-foreground">
                      {user.name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">
                      {user.name || "Unknown"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-destructive/10 text-destructive"
                        : user.role === "merchant"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
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
