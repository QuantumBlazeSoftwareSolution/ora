import Link from "next/link";
import { PricingCards } from "@/components/business/PricingCards";
import { CheckCircle, HelpCircle } from "lucide-react";
import { getSubscriptions } from "@/app/actions/subscriptions";

export default async function PricingPage() {
  const { data: plans } = await getSubscriptions();

  return (
    <div className="flex flex-col min-h-screen font-sans bg-black selection:bg-purple-500/50 text-white">
      {/* Minimal Navbar (Consistent with Business Landing) */}
      <header className="px-6 h-24 flex items-center justify-between fixed w-full top-0 z-50 transition-all bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-white">
          <Link href="/business" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-xl text-black flex items-center justify-center shadow-lg shadow-white/10">
              <span className="font-serif italic font-black text-xl">O</span>
            </div>
            <span className="font-light tracking-widest uppercase text-sm">
              ora <span className="font-bold">Pricing</span>
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-10 text-sm font-medium text-gray-400 tracking-wide">
          <Link href="/business" className="hover:text-white transition-colors">
            Overview
          </Link>
          <Link
            href="/business#features"
            className="hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="/business#showcase"
            className="hover:text-white transition-colors"
          >
            Showcase
          </Link>
        </nav>

        <div className="flex gap-6 items-center">
          <Link
            href="/business/register"
            className="text-sm font-bold bg-white text-black px-8 py-3 rounded-full hover:bg-gray-200 transition-all font-medium tracking-wide"
          >
            GET STARTED
          </Link>
        </div>
      </header>

      <main className="pt-24">
        <PricingCards initialPlans={plans || []} />

        {/* FAQ Section */}
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400">
              Everything you need to know about our pricing plans.
            </p>
          </div>

          <div className="grid gap-6">
            {[
              {
                q: "Can I switch plans later?",
                a: "Yes, you can upgrade or downgrade your plan at any time from your dashboard settings.",
              },
              {
                q: "Do I need a credit card specifically?",
                a: "No. You can start with the free plan without a card. Paid plans accept cards and local bank transfers.",
              },
              {
                q: "Is there a transaction fee?",
                a: "The Free plan has a standard 2% transaction fee. The Growth and Empire plans have 0% transaction fees.",
              },
              {
                q: "What happens after the 14-day trial?",
                a: "If you don't pick a paid plan, your account will automatically switch to the Free Starter plan. No data loss.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <h3 className="font-bold text-lg mb-2 flex items-center gap-3">
                  <HelpCircle size={20} className="text-purple-400" />
                  {item.q}
                </h3>
                <p className="text-gray-400 pl-8 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 text-center border-t border-white/10">
          <h2 className="text-4xl font-bold mb-8">Still have questions?</h2>
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-white transition-colors font-medium text-lg"
          >
            Talk to our sales team <CheckCircle size={20} />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black border-t border-white/10 text-center md:text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-gray-500 text-sm font-light">
          <div className="font-bold tracking-widest text-white uppercase">
            ora. Pricing
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">
              Legal
            </Link>
            <Link
              href="/business"
              className="hover:text-white transition-colors"
            >
              Business Home
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Support
            </Link>
          </div>
          <div>© {new Date().getFullYear()} ORA. EST. 2026.</div>
        </div>
      </footer>
    </div>
  );
}
