import { getExploreProducts } from "@/app/actions/explore";
import { ExploreGrid } from "@/components/explore/ExploreGrid";
import { ExploreSpotlight } from "@/components/explore/ExploreSpotlight";
import { CategoryPills } from "@/components/explore/CategoryPills";
import { db } from "@/db";
import { categories } from "@/db/schemas";

export const metadata = {
  title: "Explore | Ora",
  description: "Discover unique products from Sri Lanka's best businesses.",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const categorySlug = searchParams.category;
  const { data: products } = await getExploreProducts(categorySlug);
  const allCategories = await db.select().from(categories);

  // Use the first product as the "Spotlight" (if no specific logic exists yet)
  const spotlightProduct = products && products.length > 0 ? products[0] : null;

  // Filter out the spotlight product from the grid so it's not duplicated
  const gridProducts = products ? products.slice(1) : [];

  return (
    <div className="min-h-screen bg-[#050510] text-[#E0E0E0]">
      {/* Immersive Header */}
      <div className="sticky top-0 z-40 w-full bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-white">
              <div className="w-8 h-8 bg-white rounded-full text-black flex items-center justify-center font-serif italic text-lg">
                o
              </div>
              ora.
            </div>

            {/* Category Navigation */}
            <CategoryPills categories={allCategories} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!categorySlug && <ExploreSpotlight product={spotlightProduct} />}

        <ExploreGrid products={categorySlug ? products || [] : gridProducts} />
      </main>
    </div>
  );
}
