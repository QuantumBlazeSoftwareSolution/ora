import Link from "next/link";
import { CustomerHero } from "@/components/customer/CustomerHero";
import { Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-100">
      {/* Elegant Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-50 h-20 flex items-center justify-between px-6 md:px-12 transition-all">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-gray-900">
          <div className="w-8 h-8 bg-black rounded-full text-white flex items-center justify-center font-serif italic text-lg">
            o
          </div>
          ora.
        </div>

        <div className="flex items-center gap-8">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/business"
            className="text-sm font-bold bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
          >
            For Business
          </Link>
        </div>
      </header>

      <main>
        <CustomerHero />

        {/* Curated Feed Section */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Editor's Choice
              </h2>
              <p className="text-gray-500 font-light">
                Hand-picked selections for this week.
              </p>
            </div>
            <Link
              href="#"
              className="hidden md:block text-sm font-bold underline decoration-2 underline-offset-4"
            >
              View All
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-gray-100 rounded-[2rem] mb-6 overflow-hidden relative shadow-sm transition-all duration-500 hover:shadow-2xl">
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{" "}
                    4.9
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1 group-hover:underline decoration-2 underline-offset-4">
                  Minimalist Pottery
                </h3>
                <p className="text-sm text-gray-500">Colombo · Home & Living</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
        <p>&copy; 2026 Ora Marketplace. Excellence in Commerce.</p>
      </footer>
    </div>
  );
}
