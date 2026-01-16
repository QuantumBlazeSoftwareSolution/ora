import { getAllStores as fetchStores } from "@/app/actions/admin";
import { getCategories as fetchCategories } from "@/app/actions/categories";
import { StoreBrowser } from "@/components/admin/StoreBrowser";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function StoresPage() {
  const stores = await fetchStores();
  const { data: categories } = await fetchCategories();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold tracking-tight text-foreground/90">
            Stores
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Manage active storefronts, subscriptions, and compliance.
          </p>
        </div>
        <div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 text-base px-6 py-6 h-auto rounded-xl">
            <Plus className="mr-2 h-5 w-5" /> Add New Store
          </Button>
        </div>
      </div>

      {/* Client-side Store Browser */}
      <StoreBrowser initialStores={stores} categories={categories || []} />
    </div>
  );
}
