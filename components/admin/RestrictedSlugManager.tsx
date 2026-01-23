"use client";

import { useState } from "react";
import { RestrictedSlug } from "@/db/schemas/restricted-slugs";
import {
  addRestrictedSlug,
  removeRestrictedSlug,
} from "@/app/actions/restricted-slugs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, Plus, Ban } from "lucide-react";
import { toast } from "sonner";

interface RestrictedSlugManagerProps {
  initialSlugs: RestrictedSlug[];
}

export function RestrictedSlugManager({
  initialSlugs,
}: RestrictedSlugManagerProps) {
  const [newSlug, setNewSlug] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlug) return;

    setLoading(true);
    const result = await addRestrictedSlug(newSlug, reason);
    setLoading(false);

    if (result.success) {
      toast.success("Restriction added successfully");
      setNewSlug("");
      setReason("");
    } else {
      toast.error(result.error);
    }
  };

  const handleRemove = async (id: string, word: string) => {
    if (confirm(`Are you sure you want to allow "${word}"?`)) {
      const result = await removeRestrictedSlug(id);
      if (result.success) {
        toast.success("Restriction removed");
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Create Form */}
      <div className="md:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Add Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug / Word</label>
                <Input
                  value={newSlug}
                  onChange={(e) =>
                    setNewSlug(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    )
                  }
                  placeholder="e.g. admin"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Only lowercase letters, numbers, and hyphens.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason (Optional)</label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. System reserved"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !newSlug}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Plus className="mr-2" size={16} />
                )}
                Add Restriction
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Word</th>
                  <th className="text-left p-4 font-medium text-sm">Reason</th>
                  <th className="text-right p-4 font-medium text-sm">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {initialSlugs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No restricted slugs found.
                    </td>
                  </tr>
                ) : (
                  initialSlugs.map((slug) => (
                    <tr
                      key={slug.id}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Ban size={14} className="text-red-500" />
                          <span className="font-mono font-medium">
                            {slug.word}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {slug.reason || "—"}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500 transition-colors"
                          onClick={() => handleRemove(slug.id, slug.word)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
