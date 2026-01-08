
import { notFound } from 'next/navigation';
import { getStoreBySlug, getStoreContent } from '@/app/actions/public';
import { StoreHeader } from '@/components/store/store-header';
import { ProductGrid } from '@/components/store/product-grid';
import { ServiceList } from '@/components/store/service-list';
import { FloatingCart } from '@/components/store/floating-cart';
// import { StoreHeader } from '@/components/store/store-header';
// import { ProductGrid } from '@/components/store/product-grid';
// import { ServiceList } from '@/components/store/service-list';
// import { FloatingCart } from '@/components/store/floating-cart';

export default async function StorePage({ params }: { params: { slug: string } }) {
  const store = await getStoreBySlug(params.slug);

  if (!store) {
    return notFound();
  }

  const { products, services } = await getStoreContent(store.id);

  return (
    <main>
       <StoreHeader store={store} />
       
       <div className="max-w-3xl mx-auto px-4 py-8 space-y-12">
          {products.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Products</h2>
              <ProductGrid products={products} />
            </section>
          )}

          {services.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Services</h2>
              <ServiceList services={services} />
            </section>
          )}

          {products.length === 0 && services.length === 0 && (
             <div className="text-center py-20 text-muted-foreground">
                <p>This store hasn't added any items yet.</p>
             </div>
          )}
       </div>

       <FloatingCart storeName={store.name} />
    </main>
  );
}
