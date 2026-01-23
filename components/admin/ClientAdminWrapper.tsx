"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminDialog } from "./AdminDialog";

export function ClientAdminWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New Admin
      </Button>
      <AdminDialog admin={null} open={open} onOpenChange={setOpen} />
    </>
  );
}
