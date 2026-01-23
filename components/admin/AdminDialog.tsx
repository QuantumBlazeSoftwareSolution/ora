"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AdminUser,
  createAdminUser,
  updateAdminUser,
} from "@/app/actions/admin-users";
import { Loader2 } from "lucide-react";
// @ts-ignore
import { useActionState } from "react";

interface AdminDialogProps {
  admin: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? "Updating..." : "Creating..."}
        </>
      ) : isEditing ? (
        "Update Admin"
      ) : (
        "Create Admin"
      )}
    </Button>
  );
}

export function AdminDialog({ admin, open, onOpenChange }: AdminDialogProps) {
  const isEditing = !!admin;
  const action = (isEditing ? updateAdminUser : createAdminUser) as any;

  const [state, dispatch] = useActionState(action, {
    error: "",
    success: false,
  });

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Admin" : "New Admin"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update admin details and permissions."
              : "Create a new administrator account."}
          </DialogDescription>
        </DialogHeader>

        <form action={dispatch} className="grid gap-4 py-4">
          {state.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-600 text-sm">
              {state.error}
            </div>
          )}

          {isEditing && <input type="hidden" name="id" value={admin.id} />}

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={admin?.name}
              placeholder="Full Name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={admin?.email}
              placeholder="admin@ora.lk"
              required
              disabled={isEditing} // Email unique/immutable usually better
            />
          </div>

          {!isEditing && (
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" defaultValue={admin?.role || "admin"} required>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isEditing && (
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                defaultValue={admin?.status || "active"}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <SubmitButton isEditing={isEditing} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
