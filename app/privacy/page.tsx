"use client";

import Link from "next/link";
import { 
  ShieldCheckIcon,
  LockClosedIcon,
  UserIcon,
  GlobeAltIcon,
  EyeIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

export default function PrivacyPolicy() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      
      {/* Hero Section - Dark Black Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-slate-900 to-gray-900 text-white pt-32 pb-28 px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/30 via-transparent to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20 mb-8">
            <LockClosedIcon className="w-7 h-7" />
            <span className="font-semibold text-lg">Privacy Policy</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-6 leading-tight">
            Privacy Policy
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Your privacy matters. Here's how we collect, use, and protect your personal information
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#data-collection"
              className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-2xl hover:shadow-white/50 hover:bg-slate-100 transition-all duration-300 flex items-center gap-2"
            >
              <ShieldCheckIcon className="w-5 h-5" />
              View Data Practices
            </Link>
            <Link 
              href="#your-rights"
              className="px-8 py-4 border-2 border-white/30 backdrop-blur-sm font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300"
            >
              My Privacy Rights
            </Link>
          </div>
          
          <p className="text-sm text-slate-500 mt-8">
            Last updated: December 2024 • GDPR & CCPA Compliant
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Slim Navigation */}
          <div className="lg:col-span-1 lg:sticky lg:top-32 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6">Privacy Sections</h3>
              <nav className="space-y-2">
                {[
                  { href: "#overview", title: "Information We Collect" },
                  { href: "#data-collection", title: "How We Collect Data" },
                  { href: "#data-use", title: "How We Use Data" },
                  { href: "#data-sharing", title: "Data Sharing" },
                  { href: "#cookies", title: "Cookies & Tracking" },
                  { href: "#your-rights", title: "Your Privacy Rights" },
                  { href: "#security", title: "Data Security" },
                  { href: "#children", title: "Children's Privacy" },
                  { href: "#international", title: "International Transfers" },
                  { href: "#changes", title: "Policy Changes" },
                  { href: "#contact", title: "Contact Privacy Team" }
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white font-medium transition-all duration-200"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Overview */}
            <section id="overview" className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-start gap-4 mb-6">
                <ShieldCheckIcon className="w-12 h-12 text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">1. Commitment to Privacy</h2>
                  <p className="text-slate-400">Your trust is our priority</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg text-slate-300 leading-relaxed">
                <div>
                  <p className="mb-6">
                    We are committed to protecting your privacy and ensuring you have complete 
                    control over your personal information. This Privacy Policy explains our 
                    practices clearly and transparently.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    <span className="font-semibold text-emerald-300">GDPR Compliant</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <CheckCircleIcon className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <span className="font-semibold text-blue-300">CCPA Compliant</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Collection */}
            <section id="data-collection">
              <h2 className="text-3xl font-bold text-white mb-6">2. Information We Collect</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <UserIcon className="w-8 h-8 text-blue-400" />
                    Personal Information
                  </h3>
                  <ul className="space-y-3 text-slate-300">
                    <li>• Name and contact details</li>
                    <li>• Billing and shipping address</li>
                    <li>• Payment information (processed securely)</li>
                    <li>• Account credentials</li>
                  </ul>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <EyeIcon className="w-8 h-8 text-purple-400" />
                    Usage Information
                  </h3>
                  <ul className="space-y-3 text-slate-300">
                    <li>• IP address and browser type</li>
                    <li>• Pages visited and time spent</li>
                    <li>• Cookie and tracking data</li>
                    <li>• Device information</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Usage */}
            <section id="data-use">
              <h2 className="text-3xl font-bold text-white mb-6">3. How We Use Your Data</h2>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: UserIcon, title: 'Personalization', desc: 'Tailored shopping experience' },
                    { icon: ClockIcon, title: 'Order Processing', desc: 'Fulfill your purchases' },
                    { icon: GlobeAltIcon, title: 'Customer Support', desc: 'Respond to inquiries' },
                    { icon: ShieldCheckIcon, title: 'Security', desc: 'Fraud prevention' },
                    { icon: DocumentTextIcon, title: 'Legal Compliance', desc: 'Meet regulatory requirements' },
                    { icon: EyeIcon, title: 'Analytics', desc: 'Improve our services' }
                  ].map((item, i) => (
                    <div key={i} className="group p-6 text-center hover:bg-white/20 rounded-xl transition-all duration-300">
                      <item.icon className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <h4 className="font-bold text-white mb-2 group-hover:text-blue-400">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section id="data-sharing">
              <h2 className="text-3xl font-bold text-white mb-6">4. Data Sharing & Disclosure</h2>
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-md rounded-2xl p-8 border border-orange-500/20">
                <div className="max-w-2xl mx-auto">
                  <p className="text-lg text-slate-200 mb-8 leading-relaxed text-center">
                    We <strong>never sell your personal data</strong>. We only share data with:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                      <h4 className="font-bold text-white mb-3">Service Providers</h4>
                      <p className="text-slate-400 text-sm">Payment processors, shipping companies</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                      <h4 className="font-bold text-white mb-3">Legal Requirements</h4>
                      <p className="text-slate-400 text-sm">Court orders, law enforcement</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section id="cookies">
              <h2 className="text-3xl font-bold text-white mb-6">5. Cookies & Tracking</h2>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Cookie Types</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                        <span className="text-emerald-300 font-semibold">Essential</span>
                        <span className="text-slate-400 ml-auto text-sm">Always active</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-xl border border-blue-500/30">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span className="text-blue-300 font-semibold">Analytics</span>
                        <span className="text-slate-400 ml-auto text-sm">Optional</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Link href="/cookies" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full justify-center">
                      Cookie Settings
                      <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section id="your-rights">
              <h2 className="text-3xl font-bold text-white mb-6">6. Your Privacy Rights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Access', desc: 'Request copy of your data', icon: EyeIcon },
                  { title: 'Rectification', desc: 'Correct inaccurate data', icon: InformationCircleIcon },
                  { title: 'Deletion', desc: 'Request data removal', icon: DocumentTextIcon },
                  { title: 'Objection', desc: 'Object to processing', icon: ShieldCheckIcon },
                  { title: 'Portability', desc: 'Receive data in machine-readable format', icon: ArrowRightIcon },
                  { title: 'Withdraw Consent', desc: 'Stop data processing anytime', icon: LockClosedIcon }
                ].map((right, i) => (
                  <div key={i} className="group p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/15 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <right.icon className="w-12 h-12 text-emerald-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-white text-center mb-2 group-hover:text-emerald-400">{right.title}</h4>
                    <p className="text-slate-400 text-sm text-center">{right.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Security */}
            <section id="security">
              <h2 className="text-3xl font-bold text-white mb-6">7. Data Security</h2>
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-md rounded-3xl p-10 border border-emerald-500/20 shadow-2xl">
                <div className="text-center">
                  <LockClosedIcon className="w-20 h-20 text-emerald-400 mx-auto mb-8" />
                  <h3 className="text-2xl font-bold text-white mb-4">Bank-Level Security</h3>
                  <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
                    We use industry-leading encryption (AES-256), secure servers, and regular 
                    security audits to protect your data.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="text-emerald-300 font-semibold text-center py-2">SSL/TLS</div>
                    <div className="text-emerald-300 font-semibold text-center py-2">2FA</div>
                    <div className="text-emerald-300 font-semibold text-center py-2">GDPR</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section id="contact" className="text-center pt-16">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-6">Privacy Concerns?</h2>
                <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Contact our dedicated privacy team for data requests, concerns, or questions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Link 
                    href="mailto:privacy@company.com"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    privacy@company.com
                  </Link>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/50 backdrop-blur-sm font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300"
                  >
                    Contact Form
                  </Link>
                </div>
                <p className="text-slate-500 text-sm">
                  Response within 48 hours • 24/7 availability
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}