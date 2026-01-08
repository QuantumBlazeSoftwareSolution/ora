import Link from "next/link";
import { ArrowRight, ShoppingBag, MessageCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="relative px-6 py-20 md:py-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Left Column: Copy */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-white/50 border border-purple-100 backdrop-blur-sm mb-6 shadow-sm hover:shadow-md transition-all cursor-default">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-purple-900">
                Sri Lanka's #1 Creator Store
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-gray-900">
              Your Business, <br />
              <span className="text-gradient">Online in Minutes.</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Accept orders via WhatsApp. Schedule appointments. Built for Gift
              Shops, Salons, and Creatives who want to sell, not code.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/signup"
                className="h-14 px-8 rounded-full bg-primary text-white font-semibold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 hover:scale-105 transition-all shadow-lg hover:shadow-primary/30"
              >
                Start My Store <ArrowRight size={20} />
              </Link>
              <Link
                href="/demo"
                className="h-14 px-8 rounded-full bg-white text-gray-900 border border-gray-200 font-semibold text-lg flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                View Demo
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold overflow-hidden bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=${
                      i * 123
                    }')] bg-cover`}
                  />
                ))}
              </div>
              <p>Joined by 50+ local businesses</p>
            </div>
          </div>

          {/* Right Column: Visual */}
          <div className="flex-1 w-full max-w-[500px] md:max-w-none perspective-1000">
            <div className="relative w-full aspect-4/5 bg-white rounded-[2.5rem] shadow-2xl border-8 border-gray-900 overflow-hidden transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700 ease-out-back md:translate-x-10">
              {/* Mockup Header */}
              <div className="h-14 bg-gray-50 border-b flex items-center justify-between px-6">
                <div className="font-bold text-lg">My Gift Shop</div>
                <ShoppingBag size={20} className="text-gray-400" />
              </div>

              {/* Mockup Content */}
              <div className="p-6 space-y-6 bg-gray-50/50 h-full">
                {/* Hero Product */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-full h-40 bg-pink-100 rounded-xl mb-4 flex items-center justify-center text-4xl">
                    🎁
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">Custom Birthday Box</h3>
                      <p className="text-gray-500 text-sm">LKR 4,500</p>
                    </div>
                    <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Add
                    </button>
                  </div>
                </div>

                {/* Chat Bubble Animation */}
                <div className="absolute bottom-20 left-0 right-0 px-6">
                  <div className="bg-green-50 border border-green-100 p-4 rounded-2xl rounded-tl-sm shadow-lg transform translate-y-2 animate-bounce-subtle">
                    <div className="flex items-center gap-3 mb-2 text-green-700 font-medium text-sm">
                      <MessageCircle size={16} fill="currentColor" />
                      WhatsApp Output
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      "Hello! I'd like to order: <br />
                      1x Custom Birthday Box <br />
                      <strong>Total: LKR 4,500</strong>"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decor Elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-linear-to-tr from-purple-200/50 to-pink-200/50 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
