"use client";

import { 
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

export default function ShippingDelivery() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        {/* <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/30 shadow-2xl">
            <TruckIcon className="w-6 h-6 text-blue-300" />
            <span className="text-lg font-semibold text-white/90">Free Shipping on Orders Above ₹999</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-2xl tracking-tight leading-tight">
            Shipping & Delivery
          </h1>
          <p className="text-xl md:text-2xl text-slate-200/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Reliable delivery from our local store in Noida. We ship across India.
          </p>
        </div> */}

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Shipping Options */}
          <section aria-labelledby="delivery-options-heading">
            <h2 
              id="delivery-options-heading"
              className="text-3xl md:text-4xl font-bold text-white mb-10 drop-shadow-2xl tracking-tight"
            >
              Delivery Options
            </h2>
            
            <div className="space-y-6">
              {/* Standard */}
              <article className="group flex items-start gap-6 p-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl hover:-translate-y-2 hover:border-blue-400/50 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/90 to-blue-600/90 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 transition-all duration-300 border border-white/20">
                  <TruckIcon className="w-7 h-7 text-white drop-shadow-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors drop-shadow-lg">Standard Delivery</h3>
                  <p className="text-3xl font-black text-blue-300/90 mb-3 drop-shadow-xl">
                    FREE
                  </p>
                  <p className="text-lg text-slate-200 mb-2 font-medium drop-shadow-md">3-7 days</p>
                  <p className="text-base text-slate-300/80 drop-shadow-sm">Free above ₹999</p>
                  <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full mt-1 animate-pulse shadow-lg"></span>
                </div>
              </article>

              {/* Express */}
              <article className="group flex items-start gap-6 p-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl hover:-translate-y-2 hover:border-emerald-400/50 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/90 to-emerald-600/90 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 transition-all duration-300 border border-white/20">
                  <ClockIcon className="w-7 h-7 text-white drop-shadow-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors drop-shadow-lg">Express Delivery</h3>
                  <p className="text-3xl font-black text-emerald-300/90 mb-3 drop-shadow-xl">
                    ₹99
                  </p>
                  <p className="text-lg text-slate-200 mb-2 font-medium drop-shadow-md">2-4 days</p>
                  <p className="text-base text-slate-300/80 drop-shadow-sm">Major cities</p>
                  <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mt-1 animate-pulse shadow-lg"></span>
                </div>
              </article>
            </div>
          </section>

          {/* Coverage */}
          <section aria-labelledby="coverage-heading">
            <h2 
              id="coverage-heading"
              className="text-3xl md:text-4xl font-bold text-white mb-10 drop-shadow-2xl tracking-tight"
            >
              Delivery Areas
            </h2>
            <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500/90 to-orange-600/90 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl flex-shrink-0 border border-white/20">
                  <MapPinIcon className="w-9 h-9 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-xl">From Noida Store</h3>
                  <p className="text-xl text-slate-200 font-semibold drop-shadow-lg">India-wide delivery</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { city: "Delhi/NCR", time: "2-3 days" },
                  { city: "Major Cities", time: "4-6 days" },
                  { city: "Other Areas", time: "7-10 days" }
                ].map((item, index) => (
                  <div 
                    key={item.city}
                    className="group flex items-center gap-4 p-5 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 hover:border-white/30 border border-white/10 transition-all duration-300 cursor-default shadow-lg"
                  >
                    <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg group-hover:scale-125 transition-transform drop-shadow-sm"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-lg drop-shadow-md">{item.city}</p>
                      <p className="text-emerald-300 font-bold text-sm bg-emerald-500/20 px-3 py-1 rounded-full inline-block group-hover:bg-emerald-400/30 transition-all backdrop-blur-sm border border-emerald-400/30">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Support Section */}
        {/* <section className="mb-24" aria-labelledby="support-heading">
          <div className="text-center mb-16">
            <h2 
              id="support-heading"
              className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl tracking-tight leading-tight"
            >
              Need Help?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto drop-shadow-lg">
              Contact us for delivery questions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 text-center gap-8 max-w-6xl mx-auto">
            {[
              {
                id: "whatsapp",
                title: "WhatsApp",
                number: "+91 78178 35909",
                href: "https://wa.me/917817835909",
                color: "from-green-500/90 to-green-600/90",
                desc: "Reply within 1 hour",
                label: "Message Now"
              },
              {
                id: "email",
                title: "Email",
                number: "support@lycoonwear.com",
                href: "mailto:support@lycoonwear.com",
                color: "from-blue-500/90 to-blue-600/90",
                icon: EnvelopeIcon,
                desc: "Reply within 24 hours",
                label: "Send Email"
              },
              {
                id: "phone",
                title: "Phone",
                number: "+91 78178 35909",
                href: "tel:+917817835909",
                color: "from-orange-500/90 to-orange-600/90",
                icon: PhoneIcon,
                desc: "10AM-8PM daily",
                label: "Call Now"
              }
            ].map((contact) => (
              <div 
                key={contact.id}
                className="group relative p-10 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl hover:-translate-y-3 hover:border-blue-400/40 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className={`w-20 h-20 ${contact.color} backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-all duration-300 relative z-10 border border-white/20`}>
                  {contact.icon && <contact.icon className="w-9 h-9 text-white drop-shadow-lg" />}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center relative z-10 drop-shadow-xl">{contact.title}</h3>
                <p className="text-2xl md:text-3xl font-black text-slate-100 mb-4 text-center relative z-10 drop-shadow-2xl break-all">
                  {contact.number}
                </p>
                <p className="text-base text-slate-300 mb-8 text-center relative z-10 drop-shadow-md">{contact.desc}</p>
                <a 
                  href={contact.href}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] hover:from-blue-600 hover:to-purple-700 transition-all duration-300 relative z-10 group-hover:translate-x-2 backdrop-blur-sm border border-white/20"
                  aria-label={`Contact us via ${contact.title}`}
                >
                  {contact.label}
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            ))}
          </div>
        </section> */}

        {/* Final Note */}
        <div className="text-center p-12 bg-white/10 backdrop-blur-xl rounded-4xl shadow-3xl border border-white/20 max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-2xl tracking-tight">
            Ready to Order?
          </h3>
          <p className="text-xl md:text-2xl text-slate-200 mb-10 leading-relaxed max-w-2xl mx-auto drop-shadow-lg">
            Orders packed from our Noida store and shipped safely.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto">
            {[
              { icon: CheckCircleIcon, text: "COD Available" },
              { icon: TruckIcon, text: "Careful Packing" },
              { icon: ClockIcon, text: "Fast Dispatch" },
              { icon: MapPinIcon, text: "Easy Returns" }
            ].map(({ icon: Icon, text }) => (
              <div 
                key={text}
                className="flex items-center justify-center gap-4 p-6 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-semibold shadow-xl hover:scale-105 hover:-translate-y-1 hover:bg-white/30 transition-all duration-300 group border border-white/30"
              >
                <Icon className="w-6 h-6 group-hover:scale-110 transition-transform drop-shadow-lg" />
                <span className="drop-shadow-md">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style> */}
    </div>
  );
}