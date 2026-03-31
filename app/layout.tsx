import type { Metadata } from "next";
import { Playfair_Display, Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

/* ================= FONTS ================= */
const playfair = Playfair_Display({
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
  metadataBase: new URL("https://velmora.com"), // change later

  title: {
    default: "Velmora | Premium Fashion & Streetwear",
    template: "%s | Velmora",
  },

  description:
    "Velmora is a premium fashion brand offering modern streetwear, denim, and everyday essentials. Minimal, stylish, and designed for confidence.",

  keywords: [
    "Velmora",
    "streetwear brand",
    "fashion ecommerce",
    "premium clothing",
    "men fashion",
    "women fashion",
    "denim jeans",
    "minimal fashion",
  ],

  authors: [{ name: "Velmora" }],
  creator: "Velmora",
  publisher: "Velmora",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Velmora | Premium Fashion Brand",
    description:
      "Shop modern streetwear, denim, and essentials with Velmora.",
    url: "https://velmora.com",
    siteName: "Velmora",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Velmora Fashion Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Velmora Fashion",
    description: "Premium streetwear & modern fashion essentials.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

/* ================= LAYOUT ================= */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} ${dmSans.variable} antialiased bg-white text-black`}
      >
        {/* STRUCTURED DATA (ECOMMERCE) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Velmora",
              url: "https://velmora.com",
              logo: "https://velmora.com/logo.png",
              sameAs: [
                "https://instagram.com/velmora",
                "https://facebook.com/velmora",
              ],
            }),
          }}
        />

        <CartProvider>
          <WishlistProvider>
            <Navbar />
            {children}
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}