
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Calendar, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="px-6 h-16 flex items-center justify-between border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-primary">
          <div className="w-8 h-8 bg-black rounded-lg text-white flex items-center justify-center">O</div>
          ra.
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="#about" className="hover:text-primary transition-colors">About</Link>
        </nav>
        <div className="flex gap-4">
          <Link href="/login" className="text-sm font-medium flex items-center px-4 py-2 hover:bg-muted rounded-md transition-colors">Log In</Link>
          <Link href="/signup" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="bg-muted px-3 py-1 rounded-full text-xs font-medium mb-6 animate-fade-in">
          🚀 Launching in Sri Lanka
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mb-6 text-primary">
          Business Online. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Professional & Simple.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
          The all-in-one platform for Gift Shops, Salons, and Creatives. 
          Create your store, accept bookings, and manage orders — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/signup" className="h-12 px-8 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl">
            Start for Free <ArrowRight size={18} />
          </Link>
          <Link href="/demo" className="h-12 px-8 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground font-semibold flex items-center justify-center transition-all">
            View Demo Store
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Online Store</h3>
            <p className="text-muted-foreground">Provide a professional catalog for your customers. No coding required.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Calendar size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Bookings</h3>
            <p className="text-muted-foreground">Let clients book appointments directly. Perfect for Salons & Consultants.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Growth Tools</h3>
            <p className="text-muted-foreground">Track sales, manage customers, and issue discounts to grow your brand.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Ora. Built for Sri Lanka 🇱🇰</p>
      </footer>
    </div>
  );
}
