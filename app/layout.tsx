import type { Metadata } from "next";
import { Poppins, Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

/* ================= FONTS ================= */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ui",
  display: "swap",
});

/* ================= SEO ================= */
export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000/"),
  title: {
    default: "Lycoon Wear | Premium Fashion & Streetwear",
    template: "%s | Lycoon Wear",
  },
  description:
    "Lycoon Wear is a premium fashion brand offering modern streetwear, denim, and everyday essentials. Minimal, stylish, and designed for confidence.",
  keywords: [
    "Lycoon Wear",
    "streetwear brand",
    "fashion ecommerce",
    "premium clothing",
    "men fashion",
    "women fashion",
    "denim jeans",
    "minimal fashion",
  ],
  authors: [{ name: "Lycoon Wear" }],
  creator: "Lycoon Wear",
  publisher: "Lycoon Wear",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Lycoon Wear | Premium Fashion Brand",
    description: "Shop modern streetwear, denim, and essentials with Lycoon Wear.",
    url: "http://localhost:3000/",
    siteName: "Lycoon Wear",
    images: [{ url: "/images/watches.jpg", width: 1200, height: 630, alt: "Lycoonwear Fashion Collection" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lycoonwear Fashion",
    description: "Premium streetwear & modern fashion essentials.",
    images: ["/images/categories/casual-hoodie.jpg"],
  },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

/* ================= ROOT LAYOUT ================= */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${inter.variable} ${dmSans.variable} antialiased bg-white text-slate-900`}
      >
        {/* JSON-LD for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Lycoon Wear",
              url: "http://localhost:3000/",
              logo: "http://localhost:3000//lycoonwear.png",
              sameAs: [
                "https://instagram.com/lycoonwear",
                "https://facebook.com/lycoonwear",
              ],
            }),
          }}
          suppressHydrationWarning
        />

        <CartProvider>
          <WishlistProvider>
            <div className="flex flex-col min-h-dvh">
              <Navbar />
              <main className="flex-1 flex flex-col min-h-[calc(100dvh-140px)]">{children}</main>
              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}