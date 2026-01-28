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
  GripVertical,
} from "lucide-react";
import { Reorder } from "framer-motion";
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
  productLimit: number | null;
  serviceLimit: number | null;
  bookingLimit: number | null;
}

interface FeatureItem {
  id: string;
  text: string;
}

export function SubscriptionEditForm({ plan }: { plan: Subscription }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [name, setName] = useState(plan.name);
  const [price, setPrice] = useState(plan.price);
  const [description, setDescription] = useState(plan.description || "");
  const [highlight, setHighlight] = useState(plan.highlight || false);
  const [productLimit, setProductLimit] = useState(plan.productLimit || 0);
  const [serviceLimit, setServiceLimit] = useState(plan.serviceLimit || 0);
  const [bookingLimit, setBookingLimit] = useState(plan.bookingLimit || 0);

  // Initialize features with IDs for drag and drop stability
  const [features, setFeatures] = useState<FeatureItem[]>(
    (plan.features || []).map((text) => ({
      id: crypto.randomUUID(),
      text,
    })),
  );

  const handleFeatureAdd = () => {
    setFeatures((prev) => [...prev, { id: crypto.randomUUID(), text: "" }]);
  };

  const handleFeatureChange = (id: string, value: string) => {
    setFeatures((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: value } : item)),
    );
  };

  const handleFeatureRemove = (id: string) => {
    setFeatures((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name,
        price,
        description,
        features: features.map((f) => f.text),
        highlight,
        productLimit,
        serviceLimit,
        bookingLimit,
      };

      const res = await updateSubscription(plan.id, payload);
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Price (LKR)</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Product Limit</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unlimited-products"
                    checked={productLimit === -1}
                    onCheckedChange={(checked) =>
                      setProductLimit(checked ? -1 : 0)
                    }
                  />
                  <Label
                    htmlFor="unlimited-products"
                    className="text-xs font-normal text-muted-foreground cursor-pointer"
                  >
                    Unlimited
                  </Label>
                </div>
              </div>
              <Input
                type="number"
                value={productLimit === -1 ? "" : productLimit}
                onChange={(e) => setProductLimit(Number(e.target.value))}
                min={0}
                disabled={productLimit === -1}
                placeholder={productLimit === -1 ? "Unlimited" : "0"}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Service Limit</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unlimited-services"
                    checked={serviceLimit === -1}
                    onCheckedChange={(checked) =>
                      setServiceLimit(checked ? -1 : 0)
                    }
                  />
                  <Label
                    htmlFor="unlimited-services"
                    className="text-xs font-normal text-muted-foreground cursor-pointer"
                  >
                    Unlimited
                  </Label>
                </div>
              </div>
              <Input
                type="number"
                value={serviceLimit === -1 ? "" : serviceLimit}
                onChange={(e) => setServiceLimit(Number(e.target.value))}
                min={0}
                disabled={serviceLimit === -1}
                placeholder={serviceLimit === -1 ? "Unlimited" : "0"}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Booking Limit</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unlimited-bookings"
                    checked={bookingLimit === -1}
                    onCheckedChange={(checked) =>
                      setBookingLimit(checked ? -1 : 0)
                    }
                  />
                  <Label
                    htmlFor="unlimited-bookings"
                    className="text-xs font-normal text-muted-foreground cursor-pointer"
                  >
                    Unlimited
                  </Label>
                </div>
              </div>
              <Input
                type="number"
                value={bookingLimit === -1 ? "" : bookingLimit}
                onChange={(e) => setBookingLimit(Number(e.target.value))}
                min={0}
                disabled={bookingLimit === -1}
                placeholder={bookingLimit === -1 ? "Unlimited" : "0"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            <Reorder.Group
              axis="y"
              values={features}
              onReorder={setFeatures}
              className="space-y-2"
            >
              {features.map((item) => (
                <Reorder.Item key={item.id} value={item}>
                  <div className="flex gap-2 items-center">
                    <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <Input
                      value={item.text}
                      onChange={(e) =>
                        handleFeatureChange(item.id, e.target.value)
                      }
                      placeholder="Feature description"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFeatureRemove(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>

          <div className="flex items-center space-x-2 border p-3 rounded-lg">
            <Checkbox
              id="highlight"
              checked={highlight}
              onCheckedChange={(checked) => setHighlight(checked === true)}
            />
            <Label
              htmlFor="highlight"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Highlight as &quot;Most Popular&quot;
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
