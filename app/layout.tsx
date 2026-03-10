import type { Metadata } from "next";
import { Bruno_Ace, Montserrat, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

const brunoAce = Bruno_Ace({
  subsets: ["latin"],
  weight: ["400"], // Only 400 is supported
  variable: "--slider-heading",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"), // 🔥 change later

  title: {
    default: "GuardVision| CCTV Camera Installation & Security Systems",
    template: "%s | GuardVision",
  },

  description:
    "GuardVisionprovides professional CCTV camera installation, security systems, DVR/NVR setup, and electronic surveillance solutions for homes, offices, and industries.",

  keywords: [
    "CCTV installation",
    "Security cameras",
    "DVR NVR setup",
    "Home security systems",
    "Office surveillance",
    "Biometric systems",
    "Video door phone",
    "Security solutions company",
  ],

  authors: [{ name: "GuardVision" }],
  creator: "GuardVision",
  publisher: "GuardVision",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "GuardVision| CCTV Camera & Security Solutions",
    description:
      "Professional CCTV installation and security system services for residential and commercial properties.",
    url: "https://yourdomain.com",
    siteName: "GuardVision",
    images: [
      {
        url: "/og-image.jpg", // 🔥 add inside public folder
        width: 1200,
        height: 630,
        alt: "GuardVisionCCTV Installation",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "GuardVision| CCTV & Security Systems",
    description:
      "Trusted CCTV camera installation and electronic security solutions.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "geo.region": "IN-UP",
    "geo.placename": "Your City",
    "geo.position": "28.6139;77.2090",
    ICBM: "28.6139, 77.2090",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${brunoAce.variable} ${montserrat.variable} ${roboto.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "GuardVision",
              image: "https://yourdomain.com/og-image.jpg",
              "@id": "https://yourdomain.com",
              url: "https://yourdomain.com",
              telephone: "+91-XXXXXXXXXX",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Your Street Name",
                addressLocality: "Your City",
                addressRegion: "Your State",
                postalCode: "123456",
                addressCountry: "IN",
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ],
                opens: "09:00",
                closes: "18:00",
              },
            }),
          }}
        />

        <Navbar />
        <CartProvider>
          {children}
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}