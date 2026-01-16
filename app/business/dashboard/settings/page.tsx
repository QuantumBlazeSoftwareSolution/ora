"use client"; // Should be server component really but needs interactivity? No, Page is Server, Form is Client.

import { getCurrentUser } from "@/app/actions/auth";
import { getStoreByUserId, updateStore } from "@/app/actions/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Textarea } from "@/components/ui/textarea";

// We'll make this a Server Component that renders a Client Form if needed,
// or just use Server Actions directly in a form.
// For simplicity/interactivity (toast), Client Component form is better.
// But let's fetch data on server.

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/business/login");

  const store = await getStoreByUserId(user.id);
  if (!store) {
    return <div>Store not found. Please contact support.</div>;
  }

  async function updateProfile(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const logoUrl = formData.get("logoUrl") as string;
    const themeColor = formData.get("themeColor") as string;

    await updateStore(store!.id, {
      name,
      description,
      logoUrl,
      themeColor,
    });

    revalidatePath("/business/dashboard/settings");
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your store profile and configurations.
        </p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Store Profile</CardTitle>
            <CardDescription>
              This is how your store appears to the world.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateProfile} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={store.name}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Bio / Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={store.description || ""}
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  name="logoUrl"
                  defaultValue={store.logoUrl || ""}
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground">
                  Direct image URL for now.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="themeColor">Theme Color (Hex)</Label>
                <div className="flex gap-2">
                  <Input
                    id="themeColor"
                    name="themeColor"
                    defaultValue={store.themeColor || "#000000"}
                    className="w-32"
                    type="color"
                  />
                  <Input
                    name="themeColorText"
                    defaultValue={store.themeColor || "#000000"}
                    className="flex-1"
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Your current plan and billing.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div>
                <div className="font-medium">Current Plan</div>
                <div className="text-2xl font-bold mt-1 uppercase tracking-wider">
                  {store.subscription?.name || "Free"}
                </div>
              </div>
              {/* Placeholder for upgrade flow */}
              <Button variant="outline" disabled>
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
