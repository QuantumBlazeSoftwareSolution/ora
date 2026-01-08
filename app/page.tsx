import Link from "next/link";
import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { UserPersona } from "@/components/landing/UserPersona";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20">
      {/* Navbar */}
      <header className="px-6 h-20 flex items-center justify-between border-b border-transparent bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-gray-900">
          <div className="w-10 h-10 bg-primary rounded-xl text-white flex items-center justify-center shadow-lg shadow-primary/20">
            O
          </div>
          ra.
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <Link
            href="#features"
            className="hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#showcase"
            className="hover:text-primary transition-colors"
          >
            Showcase
          </Link>
          <Link
            href="#pricing"
            className="hover:text-primary transition-colors"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="text-sm font-medium flex items-center px-4 py-2 text-gray-600 hover:text-primary transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main>
        <Hero />
        <UserPersona />
        <FeatureGrid />

        {/* Simple CTA Section */}
        <section className="py-20 px-6 bg-gray-900 text-white text-center rounded-t-[3rem] mt-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to launch?
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Join the new wave of Sri Lankan entrepreneurs. <br /> No credit
              card required.
            </p>
            <Link
              href="/signup"
              className="inline-flex h-16 px-10 rounded-full bg-white text-gray-900 font-bold text-lg items-center justify-center hover:bg-gray-100 transition-all"
            >
              Create My Store Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-950 text-center text-sm text-gray-500 border-t border-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="font-bold text-2xl text-white tracking-tight">
            ora.
          </div>
          <div className="flex gap-6 mb-4">
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
          <p>
            &copy; {new Date().getFullYear()} Ora. Built with ❤️ for Sri Lanka
            🇱🇰
          </p>
        </div>
      </footer>
    </div>
  );
}
