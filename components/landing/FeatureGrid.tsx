import {
  ShoppingBag,
  Calendar,
  BarChart3,
  MessageCircle,
  Globe,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: ShoppingBag,
    title: "Instant Online Store",
    desc: "Upload photos, set prices, and share your link. Your digital catalog is ready in minutes.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Checkout",
    desc: "No complex payment gateways. Orders come directly to your WhatsApp with all details.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Calendar,
    title: "Smart Bookings",
    desc: "Perfect for Salons & Tutors. Let clients see your slots and book services instantly.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Smartphone,
    title: "Mobile First Design",
    desc: "Your store looks like a premium app on mobile phones, where your customers are.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: BarChart3,
    title: "Growth Analytics",
    desc: "See who's visiting and what's selling. Simple dashboards for busy owners.",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: Globe,
    title: "Custom Domain",
    desc: "Connect your own .com or .lk domain to build a professional brand identity.",
    color: "bg-indigo-100 text-indigo-600",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-24 px-6 bg-white relative">
      <div className="absolute inset-0 bg-grid-small-black/[0.2] -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Everything you need. <br />
            <span className="text-gray-400">Nothing you don't.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            We stripped away the complexity of traditional e-commerce. Ora gives
            you the essential tools to sell online, beautifully.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-8 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <f.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
