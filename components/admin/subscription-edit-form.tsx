"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Plus,
  Trash2,
  RefreshCw,
  RotateCcw,
  Pencil,
} from "lucide-react";
import {
  updateSubscription,
  resetSubscription,
} from "@/app/actions/subscriptions";
import { toast } from "sonner";

interface Subscription {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string | null;
  features: string[] | null;
  highlight: boolean | null;
}

export function SubscriptionEditForm({ plan }: { plan: Subscription }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [formData, setFormData] = useState({
    name: plan.name,
    price: plan.price,
    description: plan.description || "",
    features: plan.features || [],
    highlight: plan.highlight || false,
  });

  const handleFeatureAdd = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleFeatureRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateSubscription(plan.id, formData);
      if (res.success) {
        toast.success("Plan updated successfully");
        setOpen(false);
      } else {
        toast.error(res.error || "Failed to update plan");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset this plan to its defaults?"))
      return;

    setResetting(true);
    try {
      const res = await resetSubscription(plan.id, plan.slug);
      if (res.success) {
        toast.success("Plan reset to defaults");
        setOpen(false);
        // We know what the defaults are, but simpler to just reload the page or let revalidatePath handle it (which it does)
      } else {
        toast.error(res.error || "Failed to reset plan");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setResetting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="w-full mt-4 font-semibold"
        >
          <Pencil className="w-3 h-3 mr-2" /> Edit Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {plan.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Price (LKR)</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="flex justify-between items-center">
              <span>Features</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleFeatureAdd}
              >
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </Label>
            <div className="space-y-2">
              {formData.features.map((feature, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    placeholder="Feature description"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleFeatureRemove(idx)}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 border p-3 rounded-lg">
            <Checkbox
              id="highlight"
              checked={formData.highlight}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, highlight: checked === true })
              }
            />
            <Label
              htmlFor="highlight"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Highlight as "Most Popular"
            </Label>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              type="button"
              variant="destructive"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleReset}
              disabled={resetting || loading}
            >
              {resetting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}
              Reset to Defaults
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || resetting}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
