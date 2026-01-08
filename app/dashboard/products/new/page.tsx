
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createProduct } from '@/app/actions/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) return;

      let imageUrl = '';
      if (imageFile) {
        const storageRef = ref(storage, `products/${user.uid}/${Date.now()}-${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await createProduct({
        uid: user.uid,
        name,
        price: parseFloat(price),
        description,
        imageUrl,
      });

      router.push('/dashboard/products');
    } catch (error) {
      console.error(error);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard/products" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} className="mr-2" /> Back to Products
      </Link>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Handmade Soap"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price (LKR)</Label>
              <Input
                id="price"
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2500"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief details about the product..."
              />
            </div>

            <div className="grid gap-2">
              <Label>Product Image</Label>
              <div className="border-2 border-dashed border-input rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                />
                {imageFile ? (
                  <div className="text-sm font-medium text-primary">{imageFile.name}</div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click or drag image to upload</p>
                  </>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
