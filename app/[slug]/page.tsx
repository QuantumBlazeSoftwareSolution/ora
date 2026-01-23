import { notFound } from "next/navigation";
import { getStoreBySlug, getStoreContent } from "@/app/actions/public";
import { StoreHero } from "@/components/storefront/StoreHero";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { StoreNavbar } from "@/components/storefront/StoreNavbar";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // Await params to ensure it is resolved before using slug.
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) return { title: "Store Not Found" };
  return {
    title: store.name,
    description: store.description || `Welcome to ${store.name}`,
  };
}

export default async function StorePage({
  params,
}: {
  params: { slug: string };
}) {
  // Await params to handle it correctly in async component context.
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    return notFound();
  }

  const { products } = await getStoreContent(store.id);

  return (
    <main className="min-h-screen bg-white">
      <StoreNavbar storeName={store.name} />

      <StoreHero store={store} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-primary font-medium tracking-wider uppercase text-sm mb-3">
            Our Collection
          </span>
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
            Curated Details
          </h2>
          <div className="h-1 w-20 bg-primary rounded-full"></div>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-20 text-muted-foreground bg-gray-50 rounded-3xl">
            <p className="text-xl">
              This store is getting ready! Check back soon.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500">© 2026 {store.name}. Powered by Ora.</p>
        </div>
      </footer>
    </main>
  );
}
