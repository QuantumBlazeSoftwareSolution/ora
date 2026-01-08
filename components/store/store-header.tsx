
import { Store } from 'lucide-react';

export function StoreHeader({ store }: { store: any }) {
  return (
    <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
         {store.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={store.logoUrl} alt={store.name} className="w-10 h-10 rounded-full object-cover" />
         ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
               <Store size={20} />
            </div>
         )}
         <div>
           <h1 className="font-bold text-lg leading-tight">{store.name}</h1>
           <p className="text-xs text-muted-foreground">{store.description || 'Welcome to our store'}</p>
         </div>
      </div>
    </div>
  );
}
