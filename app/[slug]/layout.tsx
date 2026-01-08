
'use client';

import { CartProvider } from '@/context/cart-context';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 pb-20">
        {children}
      </div>
    </CartProvider>
  );
}
