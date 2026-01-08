import Link from "next/link";
import { BusinessHero } from "@/components/business/BusinessHero";
import { BusinessFeatures } from "@/components/business/BusinessFeatures";

export default function BusinessHome() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-black selection:bg-purple-500/50 text-white">
      {/* Dark Luxury Navbar */}
      <header className="px-6 h-24 flex items-center justify-between fixed w-full top-0 z-50 transition-all bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-white">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-xl text-black flex items-center justify-center shadow-lg shadow-white/10 group-hover:rotate-180 transition-transform duration-700">
              <span className="font-serif italic font-black text-xl">O</span>
            </div>
            <span className="font-light tracking-widest uppercase text-sm">
              ora <span className="font-bold">Business</span>
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-10 text-sm font-medium text-gray-400 tracking-wide">
          <Link href="#features" className="hover:text-white transition-colors">
            Vision
          </Link>
          <Link href="#showcase" className="hover:text-white transition-colors">
            Showcase
          </Link>
          <Link
            href="/business/pricing"
            className="hover:text-white transition-colors"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex gap-6 items-center">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors tracking-wide"
          >
            LOG IN
          </Link>
          <Link
            href="/business/register"
            className="text-sm font-bold bg-white text-black px-8 py-3 rounded-full hover:bg-gray-200 transition-all transform hover:-translate-y-1 shadow-xl shadow-white/5 tracking-wide"
          >
            GET STARTED
          </Link>
        </div>
      </header>

      <main className="pt-0">
        <BusinessHero />

        {/* Transition Section */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <BusinessFeatures />

        {/* Minimalist CTA */}
        <section className="py-40 px-6 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black pointer-events-none"></div>

          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600">
              Ready to Define the Future?
            </h2>
            <Link
              href="/business/register"
              className="inline-block px-12 py-5 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-500 text-lg tracking-widest font-bold uppercase"
            >
              Join the Elite
            </Link>
          </div>
        </section>
      </main>

      {/* Luxury Footer */}
      <footer className="py-12 px-6 bg-black border-t border-white/10 text-center md:text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-gray-500 text-sm font-light">
          <div className="font-bold tracking-widest text-white uppercase">
            ora. business
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">
              Legal
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
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
