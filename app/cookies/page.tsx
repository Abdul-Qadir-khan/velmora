"use client";

import Link from "next/link";
import { 
  // CookieIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  HeartIcon,
  Cog8ToothIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

export default function CookiesPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      
      {/* Hero Section - Dark Black Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-slate-900 to-gray-900 text-white pt-32 pb-28 px-6 lg:px-8">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/30 via-transparent to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20 mb-8">
            {/* <CookieIcon className="w-7 h-7" /> */}
            <span className="font-semibold text-lg">Cookie Policy</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-6 leading-tight">
            Cookie Policy
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Transparent information about how we use cookies to enhance your experience
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#manage"
              className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-2xl hover:shadow-white/50 hover:bg-slate-100 transition-all duration-300 flex items-center gap-2"
            >
              <Cog8ToothIcon className="w-5 h-5" />
              Manage Cookies
            </Link>
            <Link 
              href="#types"
              className="px-8 py-4 border-2 border-white/30 backdrop-blur-sm font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300"
            >
              View Details
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Slim Navigation */}
          <div className="lg:col-span-1 lg:sticky lg:top-32 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6">Quick Navigation</h3>
              <nav className="space-y-2">
                {[
                  { href: "#intro", title: "What are Cookies?" },
                  { href: "#types", title: "Cookie Types" },
                  { href: "#essential", title: "Essential" },
                  { href: "#analytics", title: "Analytics" },
                  { href: "#marketing", title: "Marketing" },
                  { href: "#manage", title: "Manage Preferences" },
                  { href: "#faq", title: "FAQ" }
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white font-medium transition-all duration-200"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Intro */}
            <section id="intro" className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-start gap-4 mb-6">
                <ShieldCheckIcon className="w-12 h-12 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Understanding Cookies</h2>
                  <p className="text-slate-400">Last updated: December 2024</p>
                </div>
              </div>
              <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                Cookies are small text files stored on your device. They help us remember your preferences, 
                keep you logged in, and analyze how you use our site to improve your experience.
              </p>
            </section>

            {/* Types Overview */}
            <section id="types">
              <h2 className="text-4xl font-bold text-white mb-8">Cookie Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    bg: 'bg-emerald-500/10 border-emerald-500/30',
                    icon: CheckCircleIcon,
                    title: 'Essential',
                    desc: 'Required for core functionality',
                    status: 'Always Active'
                  },
                  {
                    bg: 'bg-blue-500/10 border-blue-500/30',
                    icon: ChartBarIcon,
                    title: 'Analytics',
                    desc: 'Performance insights',
                    status: 'Configurable'
                  },
                  {
                    bg: 'bg-purple-500/10 border-purple-500/30',
                    icon: HeartIcon,
                    title: 'Marketing',
                    desc: 'Personalized ads',
                    status: 'Configurable'
                  }
                ].map((item) => (
                  <div className={`p-6 rounded-2xl ${item.bg} border backdrop-blur-md hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2`}>
                    <item.icon className="w-12 h-12 text-white/70 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-300 mb-4">{item.desc}</p>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold text-white">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Essential Cookies */}
            <section id="essential">
              <h2 className="text-3xl font-bold text-white mb-6">Essential Cookies</h2>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-4 pr-6 text-left font-semibold text-white">Name</th>
                      <th className="py-4 pr-6 text-left font-semibold text-white">Purpose</th>
                      <th className="py-4 text-left font-semibold text-white">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {[
                      { name: 'session_id', purpose: 'Session management', duration: 'Session' },
                      { name: 'auth_token', purpose: 'Authentication', duration: '30 days' },
                      { name: 'cart_items', purpose: 'Shopping cart', duration: '7 days' }
                    ].map((cookie) => (
                      <tr key={cookie.name} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 pr-6 font-mono text-white">{cookie.name}</td>
                        <td className="py-4 pr-6 text-slate-300">{cookie.purpose}</td>
                        <td className="py-4 text-slate-300 font-medium">{cookie.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Cookie Manager */}
            <section id="manage">
              <h2 className="text-3xl font-bold text-white mb-8">Cookie Preferences</h2>
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                    <div>
                      <h4 className="font-semibold text-white">Analytics Cookies</h4>
                      <p className="text-slate-400 text-sm">Help improve site performance</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                    <div>
                      <h4 className="font-semibold text-white">Marketing Cookies</h4>
                      <p className="text-slate-400 text-sm">Personalized advertisements</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  
                  <div className="pt-6 border-t border-white/10">
                    <Link 
                      href="#"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all duration-200"
                    >
                      Save Preferences
                      <CheckCircleIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: "Can I delete all cookies?", a: "Yes, you can clear cookies through your browser settings at any time." },
                  { q: "Are cookies dangerous?", a: "No, cookies are harmless text files used to enhance functionality." },
                  { q: "Do you share cookie data?", a: "We never sell your data. Cookies are used only to improve your experience." }
                ].map((faq, i) => (
                  <div key={i} className="group p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <h4 className="font-semibold text-white mb-2 group-hover:text-blue-400">{faq.q}</h4>
                    <p className="text-slate-400 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="text-center pt-12">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">Need Help?</h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  Contact our support team for any cookie-related questions
                </p>
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Contact Support
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}