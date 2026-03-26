export type Category =
  | "CCTV Camera"
  | "Dome Camera"
  | "Wireless Camera"
  | "AI Camera"
  | "Bullet Camera";

export type Color = "Black" | "White" | "Grey";

export type Size = "Small" | "Medium" | "Large";

export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];

  brand: {
    name: string;
    logo: string;
  };

  category: Category; // ✅ typed

  rating: number;
  stock: number;

  isNew?: boolean;
  bestSeller?: boolean;

  variations: {
    colors: Color[]; // ✅ typed
    sizes: Size[];   // ✅ typed
    specs: {
      resolution: string;
      lens: string;
      connectivity: string;
      nightVision: string;
      warranty: string;
      storage?: string;
      weatherResistance?: string;
      appSupport?: string;
    };
  };

  isInCart: boolean;
  isInWishlist: boolean;
};

export const products: Product[] = [
  {
    id: 1,
    slug: "hd-cctv-camera-pro",
    name: "HD CCTV Camera - Pro Series",
    description: "Crystal clear 1080p surveillance camera with enhanced night vision and smart motion alerts.",
    price: 299,
    originalPrice: 349,
    images: [
      "/images/products/pic1.png",
      "/images/products/pic2.png",
      "/images/products/pic3.png",
    ],
    brand: {
      name: "GuardVision",
      logo: "/images/brands/cp-plus.png",
    },
    category: "CCTV Camera",
    rating: 4.8,
    stock: 15,
    isNew: true,
    bestSeller: true, // Marked as best-seller
    variations: {
      colors: ["Black", "White", "Grey"],
      sizes: ["Small", "Medium"],
      specs: {
        resolution: "1080p Full HD",
        lens: "3.6mm fixed",
        connectivity: "Wired/Wireless",
        nightVision: "Up to 30m",
        warranty: "2 Years",
        storage: "Supports up to 128GB SD Card",
        weatherResistance: "IP66",
        appSupport: "iOS & Android",
      },
    },
    isInCart: false,
    isInWishlist: false,
  },
  {
    id: 2,
    slug: "4k-ultra-dome-camera",
    name: "4K Ultra HD Dome Camera",
    description: "Ultra HD 4K dome camera designed for commercial surveillance with wide-angle coverage.",
    price: 499,
    originalPrice: 549,
    images: [
      "/images/products/pic4.png",
      "/images/products/pic5.png",
      "/images/products/pic3.png",
    ],
    brand: {
      name: "TechGuard",
      logo: "/images/brands/hikvision.png",
    },
    category: "Dome Camera",
    rating: 4.9,
    stock: 8,
    bestSeller: true, // Marked as best-seller
    variations: {
      colors: ["Black", "White"],
      sizes: ["Medium", "Large"],
      specs: {
        resolution: "4K Ultra HD",
        lens: "2.8mm wide-angle",
        connectivity: "Wired",
        nightVision: "Up to 40m",
        warranty: "3 Years",
        storage: "NVR Compatible",
        weatherResistance: "IP67",
        appSupport: "Android, iOS, Web",
      },
    },
    isInCart: false,
    isInWishlist: false,
  },
  {
    id: 3,
    slug: "wireless-smart-security-cam",
    name: "Wireless Smart Security Camera",
    description: "Compact wireless security camera with real-time alerts and cloud storage integration.",
    price: 199,
    images: [
      "/images/products/pic5.png",
      "/images/products/pic6.png",
      "/images/products/pic3.png",
    ],
    brand: {
      name: "GuardVision",
      logo: "/images/brands/dahua.png",
    },
    category: "Wireless Camera",
    rating: 4.6,
    stock: 22,
    isNew: true,
    bestSeller: false, // Not marked as best-seller
    variations: {
      colors: ["White"],
      sizes: ["Small"],
      specs: {
        resolution: "1080p HD",
        lens: "3.6mm",
        connectivity: "Wireless",
        nightVision: "Up to 20m",
        warranty: "1 Year",
        storage: "Cloud + SD Card",
        weatherResistance: "IP65",
        appSupport: "iOS & Android",
      },
    },
    isInCart: false,
    isInWishlist: true,
  },
  {
    id: 4,
    slug: "ai-motion-detection-camera",
    name: "AI Motion Detection Camera",
    description: "Advanced AI-powered camera with facial recognition and smart tracking.",
    price: 399,
    originalPrice: 449,
    images: [
      "/images/products/pic5.png",
      "/images/products/pic7.png",
      "/images/products/pic3.png",
    ],
    brand: {
      name: "VisionPro",
      logo: "/images/brands/honeywell.png",
    },
    category: "AI Camera",
    rating: 4.7,
    stock: 10,
    bestSeller: false, // Not marked as best-seller
    variations: {
      colors: ["Black"],
      sizes: ["Medium"],
      specs: {
        resolution: "2K QHD",
        lens: "4mm AI Lens",
        connectivity: "Wired/Wireless",
        nightVision: "Up to 35m",
        warranty: "2 Years",
        storage: "Cloud + NVR",
        weatherResistance: "IP66",
        appSupport: "Android, iOS",
      },
    },
    isInCart: true,
    isInWishlist: false,
  },
  {
    id: 5,
    slug: "outdoor-bullet-security-camera",
    name: "Outdoor Bullet Security Camera",
    description: "Durable outdoor bullet camera built for harsh weather and long-distance monitoring.",
    price: 259,
    originalPrice: 299,
    images: [
      "/images/products/pic7.png",
      "/images/products/pic8.png",
      "/images/products/pic3.png",
    ],
    brand: {
      name: "SafeHome",
      logo: "/images/brands/cp-plus.png",
    },
    category: "Bullet Camera",
    rating: 4.5,
    stock: 18,
    bestSeller: false, // Not marked as best-seller
    variations: {
      colors: ["Grey", "Black"],
      sizes: ["Large"],
      specs: {
        resolution: "1080p HD",
        lens: "6mm zoom",
        connectivity: "Wired",
        nightVision: "Up to 50m",
        warranty: "2 Years",
        storage: "DVR Compatible",
        weatherResistance: "IP67",
        appSupport: "Web & Mobile",
      },
    },
    isInCart: false,
    isInWishlist: false,
  },
];

// Best Seller Filter (Optional)
const bestSellerProductIds = [1, 2]; // Example of best seller product IDs

// Create the best sellers list dynamically
export const bestSellers = products.filter(
  (product) => product.bestSeller
);
