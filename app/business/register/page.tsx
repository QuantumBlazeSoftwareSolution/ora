"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  UploadCloud,
  Store,
  User,
  CreditCard,
  Sparkles,
  Zap,
  Crown,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Subscription } from "@/db/schemas/subscriptions";
import { Category } from "@/db/schemas/categories";
import { useRouter } from "next/navigation";
import { getSubscriptions } from "@/app/actions/subscriptions";
import { submitBusinessApplication } from "@/app/actions/applications";
import { getCategories } from "@/app/actions/categories";
import { FileUpload } from "@/components/ui/file-upload";
import { checkStoreAvailability } from "@/app/actions/onboarding";

// --- Validation Schemas --- //
const step1Schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(9, "Phone number is required"),
});

const step2Schema = z.object({
  storeName: z.string().min(2, "Store name is required"),
  storeSlug: z
    .string()
    .min(2, "Store URL is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers, and dashes allowed",
    ),
  categoryId: z.string().min(1, "Please select a category"),
});

// Mock Step 3 validation (File uploads handled separately in state for MVP)
const step3Schema = z.object({});

type FormData = z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema> & {
    nicUrls?: string[];
    businessRegUrl?: string;
    subscriptionId: string;
  };

const ITEMS_PER_PAGE = 6;

// Debounce hook helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function RegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [plans, setPlans] = useState<Subscription[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Category Pagination
  const [categoryPage, setCategoryPage] = useState(0);

  // Slug Availability State
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugError, setSlugError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const plansRes = await getSubscriptions();
        if (plansRes.data) setPlans(plansRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPlans(false);
      }

      try {
        const catRes = await getCategories();
        if (catRes.success && catRes.data) setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadData();
  }, []);

  const [formData, setFormData] = useState<Partial<FormData>>({
    // subscriptionId will be set later
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [nicFrontUrl, setNicFrontUrl] = useState<string | null>(null);
  const [nicBackUrl, setNicBackUrl] = useState<string | null>(null);
  const [brUrl, setBrUrl] = useState<string | null>(null);

  // Forms
  const form1 = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || "",
    },
  });
  const form2 = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      storeName: formData.storeName || "",
      storeSlug: formData.storeSlug || "",
      categoryId: formData.categoryId || "",
    },
  });

  const onStep1Submit = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const onStep2Submit = (data: Partial<FormData>) => {
    if (slugAvailable === false) {
      toast.error("Please choose an available Store URL");
      return;
    }
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  // Real-time Slug Check Effect
  const currentSlug = form2.watch("storeSlug");
  const debouncedSlug = useDebounce(currentSlug, 500);

  useEffect(() => {
    async function check() {
      if (!debouncedSlug || debouncedSlug.length < 2) {
        setSlugAvailable(null);
        setSlugError("");
        return;
      }

      // Regex check locally first
      if (!/^[a-z0-9-]+$/.test(debouncedSlug)) {
        setSlugAvailable(false);
        setSlugError("Invalid characters");
        return;
      }

      setSlugChecking(true);
      setSlugError("");

      const result = await checkStoreAvailability(debouncedSlug);
      setSlugChecking(false);
      setSlugAvailable(result.available);
      if (!result.available) {
        setSlugError(result.error || "Unavailable");
      }
    }
    check();
  }, [debouncedSlug]);

  const onStep3Submit = () => {
    if (!nicFrontUrl || !nicBackUrl) {
      toast.error("Please upload both front and back images of your NIC/ID.");
      return;
    }
    setStep(4);
  };

  // State for Step 4 Selection
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleSubmitRegistration = async () => {
    if (!selectedPlanId) return;

    // Final Submission Logic
    setIsSubmitting(true);

    // Real Backend Request (Application)
    const result = await submitBusinessApplication({
      name: formData.name!,
      email: formData.email!,
      phone: formData.phone!,
      storeName: formData.storeName!,
      storeSlug: formData.storeSlug!,
      categoryId: formData.categoryId!,
      subscriptionId: selectedPlanId,
      nicUrls: [nicFrontUrl!, nicBackUrl!],
      businessRegUrl: brUrl || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      setShowSuccessPopup(true);
    } else {
      toast.error(result.error || "Application failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 selection:bg-purple-100 text-gray-900">
      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-purple-500 to-indigo-500"></div>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Application Received!
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Welcome to the future of commerce. Your **Application** has been
                received. Our team will review your details and approve your
                account shortly.
              </p>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mb-8">
                <p className="text-sm text-purple-800 font-medium">
                  One of our agents will contact you shortly via WhatsApp to
                  verify your store details.
                </p>
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex w-full h-14 bg-gray-900 text-white font-bold items-center justify-center rounded-xl hover:bg-black transition-all"
              >
                Go to Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8 flex justify-between items-center px-2 text-gray-900 overflow-x-auto">
          {[
            { id: 1, label: "Identity" },
            { id: 2, label: "Store" },
            { id: 3, label: "Verify" },
            { id: 4, label: "Plan" },
          ].map((s) => (
            <div key={s.id} className="flex gap-2 items-center min-w-fit">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step >= s.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {s.id}
                </div>
                <span
                  className={`text-xs font-medium ${
                    step >= s.id ? "text-purple-700" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {s.id < 4 && (
                <div
                  className={`h-1 w-8 md:w-16 rounded-full transition-all mb-4 ${
                    step > s.id ? "bg-purple-600" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-white/50">
          {/* Step 1: Identity */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <User size={24} />
                </div>
                <h1 className="text-2xl font-bold">Tell us about yourself</h1>
              </div>
              <form
                onSubmit={form1.handleSubmit(onStep1Submit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    {...form1.register("name")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                  {form1.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {form1.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    {...form1.register("email")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                  {form1.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {form1.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      {...form1.register("phone")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="077 123 4567"
                    />
                    {form1.formState.errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {form1.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full h-14 bg-gray-900 text-white font-bold rounded-xl mt-4 hover:bg-black transition-all"
                >
                  Next Step
                </button>
              </form>
            </motion.div>
          )}

          {/* Step 2: Business Info */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                  <Store size={24} />
                </div>
                <h1 className="text-2xl font-bold">Your Store details</h1>
              </div>
              <form
                onSubmit={form2.handleSubmit(onStep2Submit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Name
                  </label>
                  <input
                    {...form2.register("storeName")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="My Awesome Store"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store URL
                  </label>
                  <div className="relative">
                    <div className="flex items-center">
                      <span className="bg-gray-100 border border-r-0 border-gray-200 px-3 py-3 rounded-l-xl text-gray-500 text-sm">
                        ora.lk/
                      </span>
                      <input
                        {...form2.register("storeSlug")}
                        className={`flex-1 px-4 py-3 rounded-r-xl border focus:ring-2 focus:border-transparent outline-none transition-all ${
                          slugAvailable === false
                            ? "border-red-300 focus:ring-red-200"
                            : slugAvailable === true
                              ? "border-green-300 focus:ring-green-200"
                              : "border-gray-200 focus:ring-purple-500"
                        }`}
                        placeholder="my-store"
                        autoComplete="off"
                      />
                    </div>

                    {/* Status Indicator */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {slugChecking && (
                        <Loader2
                          size={16}
                          className="animate-spin text-gray-400"
                        />
                      )}
                      {!slugChecking && slugAvailable === true && (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                      {!slugChecking && slugAvailable === false && (
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                          Taken
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Validation Message */}
                  {!slugChecking && slugError && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {slugError}
                    </p>
                  )}
                </div>

                {/* Category Selection Grid */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Category
                    </label>

                    {/* Pagination Controls */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCategoryPage(Math.max(0, categoryPage - 1))
                        }
                        disabled={categoryPage === 0}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCategoryPage(
                            Math.min(
                              Math.ceil(categories.length / ITEMS_PER_PAGE) - 1,
                              categoryPage + 1,
                            ),
                          )
                        }
                        disabled={
                          (categoryPage + 1) * ITEMS_PER_PAGE >=
                          categories.length
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {loadingCategories ? (
                    <div className="py-10 text-center text-gray-500 text-sm flex flex-col items-center">
                      <Loader2 className="animate-spin mb-2" size={20} />
                      Loading Categories...
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {categories
                        .slice(
                          categoryPage * ITEMS_PER_PAGE,
                          (categoryPage + 1) * ITEMS_PER_PAGE,
                        )
                        .map((cat) => (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() =>
                              form2.setValue("categoryId", String(cat.id))
                            }
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                              form2.watch("categoryId") === String(cat.id)
                                ? "border-purple-500 bg-purple-50 text-purple-700 ring-1 ring-purple-500"
                                : "border-gray-200 hover:border-purple-200 hover:bg-gray-50 text-gray-600"
                            }`}
                          >
                            <span className="text-2xl">
                              {cat.imageUrl || "📦"}
                            </span>
                            <span className="text-xs font-semibold text-center">
                              {cat.name}
                            </span>
                          </button>
                        ))}
                    </div>
                  )}
                  {form2.formState.errors.categoryId && (
                    <p className="text-red-500 text-sm mt-2">
                      {form2.formState.errors.categoryId.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!slugAvailable || slugChecking}
                  className={`w-full h-14 font-bold rounded-xl mt-4 transition-all ${
                    !slugAvailable || slugChecking
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-black"
                  }`}
                >
                  Next Step
                </button>
              </form>
            </motion.div>
          )}

          {/* Step 3: Verification */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <UploadCloud size={24} />
                </div>
                <h1 className="text-2xl font-bold">Verification</h1>
              </div>

              <div className="space-y-6">
                {/* NIC Upload (Front & Back) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileUpload
                    label="NIC Front Side"
                    bucketName="documents"
                    allowedTypes={["image/png", "image/jpeg", "image/jpg"]}
                    onUploadComplete={(url) => setNicFrontUrl(url)}
                    className="bg-white"
                  />
                  <FileUpload
                    label="NIC Back Side"
                    bucketName="documents"
                    allowedTypes={["image/png", "image/jpeg", "image/jpg"]}
                    onUploadComplete={(url) => setNicBackUrl(url)}
                    className="bg-white"
                  />
                </div>

                {/* BR Upload */}
                <div className="pt-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Business Registration (Optional)
                  </p>
                  <FileUpload
                    label="Upload BR Document"
                    bucketName="documents"
                    allowedTypes={[
                      "image/png",
                      "image/jpeg",
                      "application/pdf",
                    ]}
                    onUploadComplete={(url) => setBrUrl(url)}
                    className="bg-white"
                  />
                </div>

                <button
                  onClick={onStep3Submit}
                  className="w-full h-14 bg-gray-900 text-white font-bold rounded-xl mt-4 hover:bg-black transition-all"
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Subscription Plan */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600">
                  <CreditCard size={24} />
                </div>
                <h1 className="text-2xl font-bold">Select Subscription</h1>
              </div>

              <div className="grid gap-4 mb-8">
                {loadingPlans ? (
                  <div className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto" /> Loading
                    Plans...
                  </div>
                ) : (
                  plans.map((plan) => {
                    const isGrowth = plan.slug === "growth";
                    const isSelected = selectedPlanId === plan.id;

                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`group border rounded-2xl p-4 cursor-pointer transition-all relative overflow-hidden ${
                          isSelected
                            ? "border-2 border-black bg-gray-50 shadow-xl ring-1 ring-black/5"
                            : isGrowth
                              ? "border-2 border-purple-500 bg-purple-50/10 hover:shadow-xl hover:shadow-purple-100 opacity-90"
                              : "border-gray-200 hover:border-black hover:bg-gray-50 opacity-90"
                        }`}
                      >
                        {plan.highlight && (
                          <div className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl">
                            Most Popular
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isGrowth
                                  ? "bg-purple-100 text-purple-600"
                                  : plan.slug === "empire"
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {plan.slug === "growth" ? (
                                <Zap size={20} />
                              ) : plan.slug === "empire" ? (
                                <Crown size={20} />
                              ) : (
                                <Sparkles size={20} />
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">
                                {plan.name}
                              </h3>
                              <p
                                className={`text-xs ${
                                  isGrowth ? "text-purple-600" : "text-gray-500"
                                }`}
                              >
                                {plan.billingPeriod === "forever"
                                  ? "For beginners"
                                  : plan.slug === "empire"
                                    ? "Dominate market"
                                    : "Scale faster"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="font-bold text-lg">
                                {plan.price === 0
                                  ? "Free"
                                  : `LKR ${plan.price.toLocaleString()}`}
                              </span>
                              {plan.price > 0 && (
                                <span className="text-xs text-gray-500 block">
                                  /month
                                </span>
                              )}
                            </div>
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? "border-black bg-black text-white"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <CheckCircle
                                  size={14}
                                  className="fill-white text-black"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-8 border-t pt-6 bg-white z-10">
                {isSubmitting ? (
                  <button
                    disabled
                    className="w-full h-14 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 opacity-80 cursor-wait"
                  >
                    <Loader2 className="animate-spin" /> Process Registration...
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitRegistration}
                    disabled={!selectedPlanId}
                    className={`w-full h-14 font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                      selectedPlanId
                        ? "bg-black text-white hover:scale-[1.02] shadow-xl shadow-black/20"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {selectedPlanId
                      ? "Register Your Business"
                      : "Select a Plan to Continue"}
                    {selectedPlanId && <ArrowRight size={18} />}
                  </button>
                )}
                <p className="text-center text-xs text-gray-400 mt-3">
                  By registering, you agree to our Terms of Service & Privacy
                  Policy.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
