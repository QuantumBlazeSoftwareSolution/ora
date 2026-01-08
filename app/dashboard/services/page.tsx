
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { getServices } from '@/app/actions/services';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const data = await getServices(user.uid);
        setServices(data);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <Link href="/dashboard/services/new">
          <Button className="gap-2">
            <Plus size={16} /> Add Service
          </Button>
        </Link>
      </div>

      {services.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-dashed">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Calendar size={24} />
          </div>
          <h3 className="font-semibold text-lg">No services yet</h3>
          <p className="mb-4">Add services to accept bookings.</p>
          <Link href="/dashboard/services/new">
            <Button variant="outline">Add Service</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="font-semibold text-lg">{service.name}</h3>
                   <span className="font-bold text-primary">LKR {service.price}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                    {service.durationMin} minutes
                </div>
                 <div className="text-sm">
                    {service.description || 'No description'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
