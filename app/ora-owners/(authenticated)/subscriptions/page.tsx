import { getSubscriptions } from "@/app/actions/subscriptions";
import { SubscriptionEditForm } from "@/components/admin/subscription-edit-form";
import { Check, ShieldCheck } from "lucide-react";

export default async function SubscriptionsPage() {
  const result = await getSubscriptions();
  const plans = result.data || [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
          Subscription Plans
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage pricing, features, and plan details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col p-6 bg-card border rounded-2xl shadow-sm transition-all ${
              plan.highlight
                ? "border-primary ring-1 ring-primary shadow-md"
                : "border-border"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Most Popular
              </div>
            )}

            <div className="mb-5">
              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold text-foreground">
                  {plan.price === 0
                    ? "Free"
                    : `LKR ${plan.price.toLocaleString()}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-sm text-muted-foreground">/month</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2 min-h-[40px]">
                {plan.description}
              </p>
            </div>

            <div className="flex-1 space-y-3 mb-6">
              {plan.features?.slice(0, 6).map((feature, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <div className="mt-0.5 p-0.5 rounded-full bg-green-100 text-green-600 shrink-0">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span className="text-foreground/80">{feature}</span>
                </div>
              ))}
              {(plan.features?.length || 0) > 6 && (
                <p className="text-xs text-muted-foreground pl-5 italic">
                  + {(plan.features?.length || 0) - 6} more features
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-border mt-auto">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} /> {plan.slug.toUpperCase()}
                </span>
                <span>{plan.billingPeriod}</span>
              </div>
              <SubscriptionEditForm plan={plan} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
