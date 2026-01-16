"use client";

import { useState, useEffect, useTransition } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/actions/categories";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    imageUrl: "",
  });

  async function loadCategories() {
    setLoading(true);
    const res = await getCategories();
    if (res.success && res.data) {
      setCategories(res.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug) {
      alert("Name and Slug are required.");
      return;
    }

    startTransition(async () => {
      let res;
      if (isEditing && currentId) {
        res = await updateCategory(currentId, formData);
      } else {
        res = await createCategory(formData);
      }

      if (res.success) {
        setIsOpen(false);
        resetForm();
        loadCategories();
      } else {
        alert(res.error || "Operation failed");
      }
    });
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Are you sure? This might break existing applications if linked."
      )
    )
      return;

    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.success) {
        loadCategories();
      } else {
        alert(res.error || "Failed to delete");
      }
    });
  };

  const handleEdit = (cat: any) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      imageUrl: cat.imageUrl || "",
    });
    setCurrentId(cat.id);
    setIsEditing(true);
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "", imageUrl: "" });
    setIsEditing(false);
    setCurrentId(null);
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Categories
          </h1>
          <p className="text-muted-foreground">
            Manage business categories for the platform.
          </p>
        </div>
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} /> New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Category" : "New Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Retail"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="e.g. retail"
                />
              </div>
              <div className="space-y-2">
                <Label>Icon / Image Function</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="e.g. 🛍️"
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Category" : "Create Category"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm p-4">
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            className="pl-10 bg-muted/50 border-transparent focus:bg-background transition-all"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">
            <Loader2 className="animate-spin mx-auto mb-2" /> Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Icon</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-2xl">
                      {cat.imageUrl || "📦"}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {cat.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                      {cat.slug}
                    </td>
                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => handleEdit(cat)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
