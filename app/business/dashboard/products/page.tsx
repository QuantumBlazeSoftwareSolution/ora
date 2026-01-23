"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/app/actions/auth";
import { getProducts } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { Product } from "@/db/schemas/products";

// Define a type for the product based on schema
// type Product = {
//   id: number;
//   name: string;
//   price: string;
//   imageUrl: string | null;
//   isVisible: boolean | null;
// };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const user = await getCurrentUser();
      if (user) {
        const data = await getProducts(user.id);
        setProducts(data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Link href="/dashboard/products/new">
          <Button className="gap-2">
            <Plus size={16} /> Add Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-dashed">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Package size={24} />
          </div>
          <h3 className="font-semibold text-lg">No products yet</h3>
          <p className="mb-4">Add your first product to start selling.</p>
          <Link href="/dashboard/products/new">
            <Button variant="outline">Add Product</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              {product.imageUrl && (
                <div className="aspect-video bg-muted relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <span className="font-bold">LKR {product.price}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {product.isVisible ? "Visible" : "Hidden"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
