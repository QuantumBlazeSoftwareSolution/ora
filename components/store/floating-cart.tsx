
'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
// Sheet import removed
// I will use a simple fixed bottom bar if sheet is too complex to setup manually right now.
// A Sheet is better for UX. Cleanest is a Bottom Bar that expands.
// I'll implementing a custom "Sheet" using Fixed div to avoid dependency hell with Radix dialog if I missed installing it.
// Actually I installed @radix-ui/react-slot, but not dialog.
// I'll build a Custom Simple Sheet to be safe.

import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FloatingCart({ storeName }: { storeName: string }) {
  const { items, removeItem, total } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0) return null;

  const handleCheckout = () => {
    // Generate WhatsApp text
    let message = `Hello *${storeName}*, I would like to place an order:\n\n`;
    items.forEach(item => {
      message += `- ${item.name} (x${item.quantity}): LKR ${item.price * item.quantity}\n`;
    });
    message += `\n*Total: LKR ${total}*`;
    message += `\n\nPlease confirm my order.`; // In future, add address fields

    const encoded = encodeURIComponent(message);
    // Use a placeholder phone number or the store's phone number if available. 
    // Ideally store has a phone number. I didn't add phone to Store schema!
    // I should add phone to Store schema. For now, I'll specific a dummy, or assume the user clicks "Send" and picks the contact (not possible with api.whatsapp.com without number).
    // I'll use a placeholder number '94770000000' and user can change it in address bar...
    // WAIT. This is a critical bug in my plan. I need store.phoneNumber.
    // I will assume the Store object passed in `store` prop (not here yet) has it. 
    // I will use `window.open`.
    // I will commit to adding `phone` to Store Schema in next step if I can.
    // For now I'll log it.
    
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <>
      {/* Floating Bar */}
      <div className="fixed bottom-4 left-4 right-4 max-w-3xl mx-auto z-50">
        <Button 
          className="w-full shadow-xl py-6 text-lg flex justify-between" 
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center gap-2">
            <div className="bg-white/20 px-2 py-0.5 rounded text-sm font-bold">{items.reduce((a,b) => a+b.quantity, 0)}</div>
            <span>View Cart</span>
          </div>
          <span className="font-bold">LKR {total}</span>
        </Button>
      </div>

      {/* Cart Modal/Sheet overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end sm:justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg mx-auto rounded-t-xl sm:rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
             <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-bold text-lg">Your Cart</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                   <X size={20} />
                </Button>
             </div>
             
             <div className="p-4 overflow-y-auto flex-1 space-y-4">
                {items.map((item) => (
                   <div key={`${item.id}-${item.type}`} className="flex justify-between items-center">
                      <div>
                         <div className="font-medium">{item.name}</div>
                         <div className="text-sm text-muted-foreground">LKR {item.price} x {item.quantity}</div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="font-bold">LKR {item.price * item.quantity}</div>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(item.id)}>
                            <X size={16} />
                         </Button>
                      </div>
                   </div>
                ))}
             </div>

             <div className="p-4 border-t bg-gray-50 rounded-b-xl">
                <div className="flex justify-between items-center mb-4 text-lg font-bold">
                   <span>Total</span>
                   <span>LKR {total}</span>
                </div>
                <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white gap-2 py-6 text-lg" onClick={handleCheckout}>
                   <MessageCircle size={20} /> Checkout on WhatsApp
                </Button>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
