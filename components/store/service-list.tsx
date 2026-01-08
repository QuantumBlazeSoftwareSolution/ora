
'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export function ServiceList({ services }: { services: any[] }) {
  // Services might flow differently (Calendar booking), but for Phase 1 MVP, we add to cart as a "request".
  // Or we show a "Book" button that opens a calendar?
  // User asked for "Booking". 
  // For now, let's treat it as "Request Booking" via WhatsApp for simplicity in Phase 1, 
  // but ideally it should link to a booking page.
  // Given the "Speed Run", a WhatsApp Booking Request is a valid "Booking System" MVP.

  const { addItem } = useCart();

  return (
    <div className="space-y-3">
      {services.map((service) => (
        <div key={service.id} className="bg-white border rounded-lg p-4 flex items-center justify-between shadow-sm">
           <div>
              <h3 className="font-medium mb-1">{service.name}</h3>
              <div className="flex items-center text-xs text-muted-foreground gap-3">
                 <span className="flex items-center gap-1"><Clock size={12} /> {service.durationMin} mins</span>
                 <span className="font-bold text-black">LKR {service.price}</span>
              </div>
           </div>
           <Button 
             size="sm" 
             onClick={() => addItem({
                id: service.id,
                name: service.name,
                price: parseFloat(service.price),
                type: 'service'
             })}
           >
             Book
           </Button>
        </div>
      ))}
    </div>
  );
}
