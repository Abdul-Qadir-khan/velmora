import type { Metadata } from "next";
import { Saira, Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

/* ================= FONTS ================= */
const saira = Saira({
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
  metadataBase: new URL("https://lycoonwear.com"), // change later

  title: {
    default: "Lycoon Wear | Premium Fashion & Streetwear",
    template: "%s | Lycoon Wear",
  },

  description:
    "Lycoon Wearis a premium fashion brand offering modern streetwear, denim, and everyday essentials. Minimal, stylish, and designed for confidence.",

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

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Lycoon Wear | Premium Fashion Brand",
    description:
      "Shop modern streetwear, denim, and essentials with Lycoon Wear.",
    url: "https://lycoonwear.com",
    siteName: "Lycoon Wear",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lycoonwear Fashion Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Lycoonwear Fashion",
    description: "Premium streetwear & modern fashion essentials.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

/* ================= CORRECTED LAYOUT ================= */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${saira.variable} ${inter.variable} ${dmSans.variable} antialiased bg-white text-slate-900`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Lycoon Wear",
              url: "https://lycoonwear.com",
              logo: "https://lycoonwear.com/lycoonwear.png",
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
            {/* ✅ FIXED: Added proper flex + bg + no gaps */}
            <div className="flex flex-col min-h-dvh">
              <Navbar />
              {/* ✅ FIXED: Proper main flex + full height */}
              <main className="flex-1 flex flex-col min-h-[calc(100dvh-140px)]">

                {children}
              </main>
              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}