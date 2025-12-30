"use client";

export default function Features() {
  const features = [
    {
      number: "01",
      title: "Scroll & Discover",
      description: "Watch beautiful home tours or browse curated listings. Save what speaks to you.",
      details: "Swipe through curated content that matches your taste and budget instantly.",
    },
    {
      number: "02",
      title: "Create & Tag",
      description: "Creators & sellers showcase properties in their videos. Tag homes and earn from engagement.",
      details: "Tag properties, locations, and features to make content searchable and actionable.",
    },
    {
      number: "03",
      title: "Connect & Convert",
      description: "Buyers reach out when ready. Agents receive qualified leads. Everyone wins.",
      details: "Everyone wins—buyers find dream homes, creators earn, and agents close deals.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-3 sm:mb-4">
            How Cahsai works
          </h2>
         <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-xl mx-auto mt-4 sm:mt-6 lg:mt-8">
            Cahsai makes home or apartment discovery simple: watch, explore, connect in one visual first platform.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="bg-white border-b-2 border-[#6B8E6F] p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-shadow rounded-lg"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#6B8E6F] mb-3 sm:mb-4">
                {feature.number}
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
