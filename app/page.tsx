import Link from "next/link";
import {
  Search,
  MapPin,
  ShoppingBag,
  Gift,
  Scissors,
  Coffee,
  ArrowRight,
} from "lucide-react";

export default function CustomerHome() {
  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 bg-gray-50/50">
      {/* Navbar - Customer Focused */}
      <header className="px-6 h-20 flex items-center justify-between border-b border-transparent bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-gray-900">
          <div className="w-10 h-10 bg-primary rounded-xl text-white flex items-center justify-center shadow-lg shadow-primary/20">
            O
          </div>
          ra.
        </div>

        {/* Desktop Search Bar (Optional, can be hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search for gifts, cakes, or salons..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/business"
            className="hidden md:flex text-sm font-semibold text-gray-600 hover:text-primary transition-colors mr-2"
          >
            Sell on Ora
          </Link>
          <div className="w-px h-6 bg-gray-200 hidden md:block"></div>
          <Link
            href="/login"
            className="text-sm font-medium flex items-center px-4 py-2 text-gray-600 hover:text-primary transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup" // Or a specific customer signup if separate
            className="text-sm font-medium bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-md"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Marketplace Hero */}
        <section className="px-6 py-24 md:py-32 flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-6 tracking-wide uppercase">
            <MapPin size={12} /> Supporting Local
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900 leading-[1.1]">
            Discover the best of <br className="hidden md:block" />
            <span className="text-primary">Sri Lanka's Local Creators.</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
            From handmade gifts to appointment-only salons. Support local
            businesses and find exactly what you need.
          </p>

          {/* Mobile/Main Search Box */}
          <div className="w-full max-w-2xl relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-all opacity-50"></div>
            <div className="relative flex items-center bg-white p-2 rounded-2xl shadow-xl border border-gray-100">
              <div className="pl-4 text-gray-400">
                <Search size={24} />
              </div>
              <input
                type="text"
                placeholder="What are you looking for?"
                className="flex-1 px-4 py-4 text-lg bg-transparent border-none focus:ring-0 placeholder:text-gray-400 font-medium"
              />
              <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
                Search
              </button>
            </div>
          </div>

          <div className="mt-8 flex gap-3 flex-wrap justify-center text-sm font-medium text-gray-500">
            <span>Popular:</span>
            <Link
              href="#"
              className="hover:text-primary underline decoration-dotted"
            >
              Custom Cakes
            </Link>
            <Link
              href="#"
              className="hover:text-primary underline decoration-dotted"
            >
              Birthday Gifts
            </Link>
            <Link
              href="#"
              className="hover:text-primary underline decoration-dotted"
            >
              Hair Salons
            </Link>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Explore Categories</h2>
              <Link
                href="/categories"
                className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                View all <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: Gift,
                  name: "Gifts & Crafts",
                  color: "bg-pink-100 text-pink-600",
                },
                {
                  icon: Coffee,
                  name: "Food & Treats",
                  color: "bg-orange-100 text-orange-600",
                },
                {
                  icon: Scissors,
                  name: "Salons & Spas",
                  color: "bg-purple-100 text-purple-600",
                },
                {
                  icon: ShoppingBag,
                  name: "Fashion",
                  color: "bg-blue-100 text-blue-600",
                },
              ].map((cat, i) => (
                <Link
                  key={i}
                  href="#"
                  className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center gap-4"
                >
                  <div
                    className={`w-16 h-16 ${cat.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <cat.icon size={32} />
                  </div>
                  <span className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA for Sellers */}
        <section className="px-6 py-20 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto bg-gray-900 rounded-[2.5rem] p-10 md:p-16 text-center md:text-left relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-lg">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Run a business?
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                  Join thousands of local creators using Ora to manage their
                  store and bookings online.
                </p>
                <Link
                  href="/business"
                  className="inline-flex h-12 px-8 rounded-full bg-white text-gray-900 font-bold items-center justify-center hover:bg-gray-100 transition-all"
                >
                  Sell on Ora
                </Link>
              </div>
              {/* Decorative Circle */}
              <div className="w-64 h-64 bg-primary rounded-full blur-3xl opacity-20 absolute -right-20 -top-20"></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t text-center text-sm text-gray-500 bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="font-bold text-2xl text-gray-900 tracking-tight">
            ora.
          </div>
          <p>&copy; {new Date().getFullYear()} Ora. Marketplace.</p>
        </div>
      </footer>
    </div>
  );
}
