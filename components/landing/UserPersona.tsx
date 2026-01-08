export function UserPersona() {
  const personas = [
    {
      emoji: "🎁",
      title: "Gift & Crafts",
      desc: "Showcase your hampers and handmade items with a beautiful gallery.",
      tag: "Catalog Mode",
    },
    {
      emoji: "💇‍♀️",
      title: "Salons & Spas",
      desc: "Fill your appointment book. Let clients reserve slots 24/7.",
      tag: "Booking Engine",
    },
    {
      emoji: "🍰",
      title: "Home Bakers",
      desc: "Take cake orders with custom requirements directly to WhatsApp.",
      tag: "Order Forms",
    },
    {
      emoji: "🎓",
      title: "Tutors & Coaches",
      desc: "Schedule classes and consultations without back-and-forth calls.",
      tag: "Scheduling",
    },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Built for <span className="text-primary">Makers & Doers</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Whether you sell products or time, Ora adapts to your business
              model. No hacky workarounds needed.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
              Product Sales
            </span>
            <span className="px-4 py-1 rounded-full bg-purple-100 text-purple-700 font-medium text-sm">
              Service Bookings
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {personas.map((p, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/20 transition-colors text-center md:text-left"
            >
              <div className="text-5xl mb-4 transform hover:scale-110 transition-transform cursor-default inline-block">
                {p.emoji}
              </div>
              <div className="mb-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                  {p.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
