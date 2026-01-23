"use client";

import { useState } from "react";
import { AdminUser, deleteAdminUser } from "@/app/actions/admin-users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Shield,
  ShieldAlert,
  UserCog,
  Loader2,
} from "lucide-react";
import { AdminDialog } from "./AdminDialog";

export function AdminList({ admins }: { admins: AdminUser[] }) {
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleEdit = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this admin? This action cannot be undone.",
      )
    )
      return;

    setIsDeleting(id);
    const res = await deleteAdminUser(id);
    setIsDeleting(null);

    if (!res.success && res.error) {
      alert(res.error);
    }
  };

  return (
    <>
      <div className="rounded-md border bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Admin</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {admins.map((admin) => (
              <tr
                key={admin.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      {admin.role === "super_admin" ? (
                        <ShieldAlert size={14} />
                      ) : (
                        <Shield size={14} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {admin.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {admin.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      admin.role === "super_admin" ? "destructive" : "secondary"
                    }
                  >
                    {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className={
                      admin.status === "active"
                        ? "text-green-600 border-green-600/20 bg-green-500/10"
                        : "text-red-600 border-red-600/20 bg-red-500/10"
                    }
                  >
                    {admin.status || "active"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {isDeleting === admin.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreHorizontal className="h-4 w-4" />
                        )}
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(admin)}>
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleDelete(admin.id)}
                      >
                        Delete Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminDialog
        admin={selectedAdmin}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedAdmin(null);
        }}
      />
    </>
  );
}
