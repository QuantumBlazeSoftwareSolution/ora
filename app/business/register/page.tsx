"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

// Form Schemas
const personalSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone number required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const businessSchema = z.object({
  storeName: z.string().min(2, "Store name is required"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
});

export default function RegistrationWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forms
  const personalForm = useForm({ resolver: zodResolver(personalSchema) });
  const businessForm = useForm({ resolver: zodResolver(businessSchema) });

  const onPersonalSubmit = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const onBusinessSubmit = async (data: any) => {
    const finalData = { ...formData, ...data };
    setIsSubmitting(true);
    // Mock UID for now
    const mockUid = "mock-user-" + Date.now();

    // Update state immediately so UI updates on success
    setFormData((prev: any) => ({ ...prev, ...data }));

    const result = await registerBusiness({
      uid: mockUid,
      email: finalData.email,
      name: finalData.name,
      storeName: finalData.storeName,
      slug: finalData.slug,
      category: finalData.category,
      description: finalData.description,
    });

    if (result.success) {
      setStep(3);
    } else {
      // Handle error (alert for now)
      alert(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-6">
      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i <= step ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {step === 1 && "Let's start with you"}
          {step === 2 && "Tell us about your business"}
          {step === 3 && "Verification"}
        </h1>
        <p className="text-gray-500">Step {step} of 3</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {step === 1 && (
          <form
            onSubmit={personalForm.handleSubmit(onPersonalSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  {...personalForm.register("name")}
                  placeholder="Saman Perera"
                />
                {personalForm.formState.errors.name && (
                  <p className="text-red-500 text-sm">
                    {String(personalForm.formState.errors.name.message)}
                  </p>
                )}
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  {...personalForm.register("email")}
                  type="email"
                  placeholder="saman@example.com"
                />
                {personalForm.formState.errors.email && (
                  <p className="text-red-500 text-sm">
                    {String(personalForm.formState.errors.email.message)}
                  </p>
                )}
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  {...personalForm.register("phone")}
                  placeholder="0771234567"
                />
                {personalForm.formState.errors.phone && (
                  <p className="text-red-500 text-sm">
                    {String(personalForm.formState.errors.phone.message)}
                  </p>
                )}
              </div>
              <div>
                <Label>Password</Label>
                <Input {...personalForm.register("password")} type="password" />
                {personalForm.formState.errors.password && (
                  <p className="text-red-500 text-sm">
                    {String(personalForm.formState.errors.password.message)}
                  </p>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full">
              Next Step <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={businessForm.handleSubmit(onBusinessSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div>
                <Label>Store Name</Label>
                <Input
                  {...businessForm.register("storeName")}
                  placeholder="Saman's Gifts"
                />
                {businessForm.formState.errors.storeName && (
                  <p className="text-red-500 text-sm">
                    {String(businessForm.formState.errors.storeName.message)}
                  </p>
                )}
              </div>
              <div>
                <Label>Store URL (ora.lk/...)</Label>
                <Input
                  {...businessForm.register("slug")}
                  placeholder="samans-gifts"
                />
                {businessForm.formState.errors.slug && (
                  <p className="text-red-500 text-sm">
                    {String(businessForm.formState.errors.slug.message)}
                  </p>
                )}
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  {...businessForm.register("category")}
                  placeholder="e.g. Gift Shop"
                />
                {businessForm.formState.errors.category && (
                  <p className="text-red-500 text-sm">
                    {String(businessForm.formState.errors.category.message)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 animate-spin" /> {/* Or Check icon */}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Application Received!
            </h3>
            <p className="text-gray-500 mb-8">
              Your store <strong>{formData.storeName}</strong> has been
              submitted for review.
              <br /> We will verify your details and activate your store
              shortly.
            </p>
            <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm mb-8">
              Status: <span className="font-bold">Pending Approval</span>
            </div>
            <Button
              className="w-full"
              onClick={() => (window.location.href = "/")}
            >
              Return Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
