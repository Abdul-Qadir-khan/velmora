"use client";

import Link from "next/link";
import { 
  DocumentTextIcon,
  ShieldCheckIcon,
  ScaleIcon,
  ClockIcon,
  UserIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      
      {/* Hero Section - Dark Black Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-slate-900 to-gray-900 text-white pt-32 pb-28 px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/30 via-transparent to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20 mb-8">
            <DocumentTextIcon className="w-7 h-7" />
            <span className="font-semibold text-lg">Terms of Service</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-6 leading-tight">
            Terms of Service
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Please read these terms carefully before using our services
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#acceptance"
              className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-2xl hover:shadow-white/50 hover:bg-slate-100 transition-all duration-300 flex items-center gap-2"
            >
              <CheckCircleIcon className="w-5 h-5" />
              I Accept
            </Link>
            <Link 
              href="#overview"
              className="px-8 py-4 border-2 border-white/30 backdrop-blur-sm font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300"
            >
              Read Terms
            </Link>
          </div>
          
          <p className="text-sm text-slate-500 mt-8">
            Last updated: December 2024
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Slim Navigation */}
          <div className="lg:col-span-1 lg:sticky lg:top-32 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6">Table of Contents</h3>
              <nav className="space-y-2">
                {[
                  { href: "#overview", title: "Overview" },
                  { href: "#acceptance", title: "Acceptance of Terms" },
                  { href: "#user-account", title: "User Accounts" },
                  { href: "#services", title: "Our Services" },
                  { href: "#payments", title: "Payments & Billing" },
                  { href: "#content", title: "User Content" },
                  { href: "#prohibited", title: "Prohibited Activities" },
                  { href: "#termination", title: "Termination" },
                  { href: "#liability", title: "Limitation of Liability" },
                  { href: "#governing", title: "Governing Law" },
                  { href: "#contact", title: "Contact Us" }
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
          <div className="lg:col-span-3 space-y-12 prose prose-invert max-w-none">
            
            {/* Overview */}
            <section id="overview" className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-start gap-4 mb-6">
                <InformationCircleIcon className="w-12 h-12 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">1. Overview</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg text-slate-300 leading-relaxed">
                <div>
                  <p className="mb-6">
                    Welcome to our platform. These Terms of Service ("Terms") govern your access to and use 
                    of our website and services ("Services"). By accessing or using our Services, you agree 
                    to be bound by these Terms.
                  </p>
                  <p>
                    If you do not agree with any part of these Terms, you must not use our Services.
                  </p>
                </div>
                <div className="space-y-4 pt-4 md:pt-0 md:border-l border-slate-700 pl-0 md:pl-8">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <ClockIcon className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    <span className="font-semibold text-emerald-300">Effective Date: December 1, 2024</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <ScaleIcon className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <span className="font-semibold text-blue-300">Governed by US Law</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Acceptance */}
            <section id="acceptance">
              <h2 className="text-3xl font-bold text-white mb-6">2. Acceptance of Terms</h2>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">By using our Services, you agree to:</h3>
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-start gap-3">
                        <ShieldCheckIcon className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
                        Comply with all applicable laws and regulations
                      </li>
                      <li className="flex items-start gap-3">
                        <LockClosedIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                        Provide accurate information during registration
                      </li>
                      <li className="flex items-start gap-3">
                        <UserIcon className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                        Not impersonate any other person or entity
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                    <h4 className="font-bold text-white mb-4">Changes to Terms</h4>
                    <p className="text-slate-400 mb-4">
                      We may update these Terms from time to time. Continued use after changes 
                      constitutes acceptance of the revised Terms.
                    </p>
                    <Link href="#contact" className="text-blue-400 hover:text-blue-300 font-semibold">
                      We'll notify you of material changes →
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* User Account */}
            <section id="user-account">
              <h2 className="text-3xl font-bold text-white mb-6">3. User Accounts</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Account Creation</h3>
                  <ul className="space-y-3 text-slate-300 text-sm">
                    <li>• Must be 18+ years old</li>
                    <li>• Provide valid email address</li>
                    <li>• Create a strong password</li>
                    <li>• Verify your account via email</li>
                  </ul>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Account Security</h3>
                  <p className="text-slate-300 mb-4">
                    You are responsible for maintaining the confidentiality of your account 
                    and password. Notify us immediately of any unauthorized use.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-semibold">Account Suspension</span>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-semibold">Violations</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Services */}
            <section id="services">
              <h2 className="text-3xl font-bold text-white mb-6">4. Our Services</h2>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <p className="text-lg text-slate-300 mb-8">
                  We provide an online platform for purchasing goods. Services are provided "as is" 
                  without warranties of any kind, express or implied.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6">
                    <GlobeAltIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h4 className="font-bold text-white mb-2">Global Access</h4>
                    <p className="text-slate-400 text-sm">Available worldwide</p>
                  </div>
                  <div className="text-center p-6">
                    <ClockIcon className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h4 className="font-bold text-white mb-2">24/7 Support</h4>
                    <p className="text-slate-400 text-sm">Round the clock assistance</p>
                  </div>
                  <div className="text-center p-6">
                    <LockClosedIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h4 className="font-bold text-white mb-2">Secure Payments</h4>
                    <p className="text-slate-400 text-sm">PCI DSS compliant</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section id="liability">
              <h2 className="text-3xl font-bold text-white mb-6">5. Limitation of Liability</h2>
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-md rounded-2xl p-8 border border-red-500/20">
                <div className="flex items-start gap-4 mb-6">
                  <ScaleIcon className="w-12 h-12 text-red-400 mt-1 flex-shrink-0" />
                  <h3 className="text-2xl font-bold text-white">Important Legal Notice</h3>
                </div>
                <p className="text-lg text-slate-200 mb-6 leading-relaxed">
                  To the maximum extent permitted by law, we shall not be liable for any indirect, 
                  incidental, special, consequential or punitive damages, including loss of profits.
                </p>
                <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                  <p className="text-slate-300 text-sm">
                    <strong>Our total liability</strong> shall not exceed the amount you paid us in the 
                    twelve (12) months preceding the claim.
                  </p>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section id="governing">
              <h2 className="text-3xl font-bold text-white mb-6">6. Governing Law</h2>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Jurisdiction</h3>
                  <p className="text-slate-300">
                    These Terms are governed by the laws of the State of Delaware, USA, without regard 
                    to conflict of law principles.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Dispute Resolution</h3>
                  <p className="text-slate-300">
                    Any disputes shall be resolved exclusively in the state or federal courts located 
                    in Delaware. You consent to the personal jurisdiction of these courts.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section id="contact" className="text-center pt-16">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-6">Questions About These Terms?</h2>
                <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Our support team is ready to answer any questions you may have about our Terms of Service.
                </p>
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
                >
                  Contact Support
                  <ArrowRightIcon className="w-6 h-6" />
                </Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}