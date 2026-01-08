"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  Upload,
  CheckCircle,
  Store,
  User,
  FileText,
} from "lucide-react";
import { registerBusiness } from "@/app/actions/onboarding";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface FormData {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  storeName?: string;
  slug?: string;
  categoryId?: number;
  categoryName?: string;
  description?: string;
  nicUrl?: string;
  businessRegUrl?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

// Mock Categories (Replace with DB fetch later)
const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Gifts & Crafts", slug: "gifts-crafts", icon: "🎁" },
  { id: 2, name: "Salons & Spas", slug: "salons-spas", icon: "✂️" },
  { id: 3, name: "Food & Bakery", slug: "food-bakery", icon: "🍰" },
  { id: 4, name: "Fashion", slug: "fashion", icon: "👗" },
  { id: 5, name: "Art & Design", slug: "art-design", icon: "🎨" },
  { id: 6, name: "Other", slug: "other", icon: "✨" },
];

// --- Schemas ---
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
    .regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only"),
  categoryId: z.number().min(1, "Please select a category"),
  description: z.string().optional(),
});

// Mock Doc Schema
const documentSchema = z.object({
  nicUrl: z.string().min(1, "National ID is required"),
  businessRegUrl: z.string().optional(),
});

export default function RegistrationWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forms
  const personalForm = useForm<z.infer<typeof personalSchema>>({
    resolver: zodResolver(personalSchema),
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });

  const businessForm = useForm<z.infer<typeof businessSchema>>({
    resolver: zodResolver(businessSchema),
    defaultValues: { storeName: "", slug: "", description: "" },
  });

  const docForm = useForm<z.infer<typeof documentSchema>>({
    resolver: zodResolver(documentSchema),
    defaultValues: { nicUrl: "", businessRegUrl: "" },
  });

  // Handlers
  const onPersonalSubmit = (data: z.infer<typeof personalSchema>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const onBusinessSubmit = (data: z.infer<typeof businessSchema>) => {
    const selectedCat = MOCK_CATEGORIES.find((c) => c.id === data.categoryId);
    setFormData((prev) => ({
      ...prev,
      ...data,
      categoryName: selectedCat?.name,
    }));
    setStep(3);
  };

  const onFinalSubmit = async (data: z.infer<typeof documentSchema>) => {
    const finalData = { ...formData, ...data };
    setIsSubmitting(true);

    // Mock UID
    const mockUid = "mock-user-" + Date.now();
    setFormData((prev) => ({ ...prev, ...data }));

    const result = await registerBusiness({
      uid: mockUid,
      email: finalData.email!,
      name: finalData.name!,
      storeName: finalData.storeName!,
      slug: finalData.slug!,
      categoryId: finalData.categoryId!,
      description: finalData.description,
      nicUrl: finalData.nicUrl!,
      businessRegUrl: finalData.businessRegUrl,
    });

    if (result.success) {
      setStep(4);
    } else {
      alert(result.error);
    }
    setIsSubmitting(false);
  };

  // Helper for Category Selection
  const selectCategory = (id: number) => {
    businessForm.setValue("categoryId", id, { shouldValidate: true });
  };

  // Helper for "Mock" Upload
  const handleFileUpload = (field: "nicUrl" | "businessRegUrl") => {
    // Simulate upload delay
    setTimeout(() => {
      docForm.setValue(
        field,
        `https://mock-storage.com/${field}-${Date.now()}.jpg`,
        { shouldValidate: true }
      );
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-primary/20">
      <div className="max-w-3xl mx-auto">
        {/* Progress Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-2">
            Create your Ora Store
          </h1>
          <p className="text-gray-500 text-lg">
            Join Sri Lanka's fastest growing marketplace
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-between items-center mb-10 px-8 max-w-lg mx-auto relative">
          {[
            { id: 1, label: "Personal", icon: User },
            { id: 2, label: "Business", icon: Store },
            { id: 3, label: "Verify", icon: CheckCircle },
          ].map((s) => (
            <div key={s.id} className="flex flex-col items-center z-10">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 shadow-sm
                  ${
                    step >= s.id
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-110"
                      : "bg-white border-gray-200 text-gray-400"
                  }`}
              >
                <s.icon size={20} />
              </div>
              <div
                className={`text-sm font-semibold mt-3 ${
                  step >= s.id ? "text-primary" : "text-gray-400"
                }`}
              >
                {s.label}
              </div>
            </div>
          ))}
          {/* Progress Bar Line */}
          <div className="absolute top-[24px] left-0 w-full h-0.5 bg-gray-200 -z-0 hidden md:block">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-white/50">
          <AnimatePresence mode="wait">
            {/* STEP 1: Personal Info */}
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={personalForm.handleSubmit(onPersonalSubmit)}
                className="space-y-6"
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">
                        Full Name
                      </Label>
                      <Input
                        {...personalForm.register("name")}
                        placeholder="Saman Perera"
                        className="h-14 bg-gray-50 border-gray-200 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all rounded-xl"
                      />
                      <p className="text-xs text-red-500">
                        {personalForm.formState.errors.name?.message}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">
                        Phone Number
                      </Label>
                      <Input
                        {...personalForm.register("phone")}
                        placeholder="0771234567"
                        className="h-14 bg-gray-50 border-gray-200 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all rounded-xl"
                      />
                      <p className="text-xs text-red-500">
                        {personalForm.formState.errors.phone?.message}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Email Address
                    </Label>
                    <Input
                      {...personalForm.register("email")}
                      type="email"
                      placeholder="saman@example.com"
                      className="h-14 bg-gray-50 border-gray-200 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all rounded-xl"
                    />
                    <p className="text-xs text-red-500">
                      {personalForm.formState.errors.email?.message}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Password
                    </Label>
                    <Input
                      {...personalForm.register("password")}
                      type="password"
                      className="h-14 bg-gray-50 border-gray-200 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all rounded-xl"
                    />
                    <p className="text-xs text-red-500">
                      {personalForm.formState.errors.password?.message}
                    </p>
                  </div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                >
                  Next Step <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.form>
            )}

            {/* STEP 2: Business Info */}
            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={businessForm.handleSubmit(onBusinessSubmit)}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Store Name
                    </Label>
                    <Input
                      {...businessForm.register("storeName")}
                      placeholder="e.g. Saman's Gifts"
                      className="h-14 text-lg font-medium bg-gray-50 border-gray-200 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all rounded-xl"
                    />
                    <p className="text-xs text-red-500">
                      {businessForm.formState.errors.storeName?.message}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-700 font-medium">
                      Choose a Category
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                      {MOCK_CATEGORIES.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => selectCategory(cat.id)}
                          className={`cursor-pointer p-4 rounded-2xl border-2 transition-all text-center flex flex-col items-center gap-2 group
                            ${
                              businessForm.watch("categoryId") === cat.id
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-gray-100 hover:border-primary/30 hover:bg-gray-50 text-gray-600"
                            }`}
                        >
                          <span className="text-3xl mb-1 group-hover:scale-110 transition-transform duration-300">
                            {cat.icon}
                          </span>
                          <span className="text-sm font-bold">{cat.name}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-red-500">
                      {businessForm.formState.errors.categoryId?.message}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Your Web Address
                    </Label>
                    <div className="flex shadow-sm rounded-xl overflow-hidden">
                      <span className="flex items-center px-5 bg-gray-100 border border-r-0 border-gray-200 text-gray-500 font-medium">
                        ora.lk/
                      </span>
                      <Input
                        {...businessForm.register("slug")}
                        placeholder="samans-gifts"
                        className="h-14 rounded-l-none bg-white border-2 border-gray-100 focus:border-primary focus:ring-0 transition-all font-bold text-primary text-lg"
                      />
                    </div>
                    <p className="text-xs text-red-500">
                      {businessForm.formState.errors.slug?.message}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="text-gray-500 hover:text-gray-900 h-14 px-6"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 h-14 text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                  >
                    Next Step
                  </Button>
                </div>
              </motion.form>
            )}

            {/* STEP 3: Verification */}
            {step === 3 && (
              <motion.form
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={docForm.handleSubmit(onFinalSubmit)}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="bg-blue-50/80 p-5 rounded-2xl flex items-start gap-4 border border-blue-100">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="text-sm text-blue-800 leading-relaxed">
                      To keep Ora safe and premium, we need to verify your
                      identity. <br />
                      <span className="font-semibold block mt-1">
                        National ID (NIC) is required. Business Registration
                        (BR) is optional.
                      </span>
                    </div>
                  </div>

                  {/* NIC Upload */}
                  <div className="space-y-3">
                    <Label className="text-gray-900 font-bold text-lg">
                      National ID (NIC) <span className="text-red-500">*</span>
                    </Label>
                    <div
                      onClick={() => handleFileUpload("nicUrl")}
                      className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all group
                           ${
                             docForm.watch("nicUrl")
                               ? "border-green-500 bg-green-50/50"
                               : "border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                           }
                         `}
                    >
                      {docForm.watch("nicUrl") ? (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          <CheckCircle
                            className="text-green-500 mb-3 mx-auto"
                            size={40}
                          />
                          <span className="block text-green-700 font-bold text-lg">
                            NIC Uploaded Successfully
                          </span>
                          <span className="text-sm text-green-600 mt-1">
                            Ready to submit
                          </span>
                        </motion.div>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-gray-100 group-hover:bg-white group-hover:shadow-md rounded-full flex items-center justify-center mb-4 text-gray-400 group-hover:text-primary transition-all duration-300">
                            <Upload size={28} />
                          </div>
                          <span className="block text-gray-900 font-bold text-lg">
                            Upload NIC Side 1
                          </span>
                          <span className="text-sm text-gray-500 mt-2">
                            JPG, PNG or PDF (Max 5MB)
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-red-500">
                      {docForm.formState.errors.nicUrl?.message}
                    </p>
                  </div>

                  {/* BR Upload */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-gray-700 font-medium">
                        Business Registration (BR)
                      </Label>
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                        Optional
                      </span>
                    </div>
                    <div
                      onClick={() => handleFileUpload("businessRegUrl")}
                      className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all
                           ${
                             docForm.watch("businessRegUrl")
                               ? "border-green-500 bg-green-50/50"
                               : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                           }
                         `}
                    >
                      {docForm.watch("businessRegUrl") ? (
                        <div className="flex items-center gap-2 text-green-700 font-medium">
                          <CheckCircle size={20} />
                          <span>BR Document Attached</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm font-medium">
                          Click to upload BR Copy (If available)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(2)}
                    className="text-gray-500 hover:text-gray-900 h-14 px-6"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 h-14 text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </motion.form>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-100">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="text-4xl font-heading font-bold text-gray-900 mb-4">
                  Application Received!
                </h3>
                <p className="text-gray-500 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                  Your store <strong>{formData.storeName}</strong> has been
                  submitted. Our team will verify your NIC and activate your
                  store within 24 hours.
                </p>
                <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 px-8 py-4 rounded-2xl text-base font-bold mb-12 border border-blue-100">
                  <Loader2 size={20} className="animate-spin" />
                  Status: Pending Approval
                </div>
                <Button
                  size="lg"
                  className="w-full h-14 text-lg rounded-xl"
                  onClick={() => (window.location.href = "/")}
                >
                  Return Home
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Support Link */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Need help?{" "}
            <a href="#" className="text-primary hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
