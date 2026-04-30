import { Shield, Truck, RefreshCw, Star, Award, ShoppingBag } from "lucide-react";
import Link from "next/link";

const WhyChooseSection = () => {
  const features = [
    { icon: Shield, title: "Premium Quality", desc: "Delhi Standards", stat: "100K+" },
    { icon: Truck, title: "Free Delivery", desc: "Delhi-NCR 24hr", stat: "Same Day" },
    { icon: RefreshCw, title: "Easy Returns", desc: "7 Days Free", stat: "No Hassle" },
    { icon: Star, title: "Top Rated", desc: "Customer Loved", stat: "4.9⭐" },
    { icon: Award, title: "Limited Stock", desc: "Delhi Exclusive", stat: "Drop Now" }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50/50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Compact Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-2 leading-tight">
            Why Choose Us
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto">
            Delhi's trusted fashion destination
          </p>
        </div>

        {/* Tight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group relative bg-white/60 backdrop-blur-sm rounded-2xl p-4 hover:shadow-lg hover:-translate-y-2 transition-all duration-400 border border-slate-100 h-full flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-7 h-7 text-slate-700" />
                </div>
                
                {/* Compact Content */}
                <div className="space-y-2 flex-1 flex flex-col justify-center">
                  <h3 className="text-lg font-medium text-slate-900 group-hover:text-slate-800 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    {feature.desc}
                  </p>
                </div>
                
                {/* Stat */}
                <div className="pt-2 mt-auto">
                  <span className="text-sm font-semibold text-slate-800">
                    {feature.stat}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compact CTA */}
        <div className="text-center mt-16 pt-12 border-t border-slate-200">
          <Link 
            href="/shop"
            className="group inline-flex items-center gap-2 px-8 py-4 text-lg font-medium text-slate-900 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            Shop Now
            <ShoppingBag size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;