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
    category: string;
    rating: number;
    stock: number;
    isNew?: boolean;
    variations: {
      colors: string[];
      sizes: string[];
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
  };
  
  export const products: Product[] = [
    {
      id: 1,
      slug: "hd-cctv-camera-pro",
      name: "HD CCTV Camera - Pro Series",
      description:
        "Crystal clear 1080p surveillance camera with enhanced night vision and smart motion alerts.",
      price: 299,
      originalPrice: 349,
      images: [
        "/images/dome-camera.webp",
        "/images/bullet-camera.webp",
        "/images/wireless-camera.webp",
        "/images/pole-camera.webp",
      ],
      brand: {
        name: "SecureTech",
        logo: "/images/brands/cp-plus.png",
      },
      category: "CCTV Camera",
      rating: 4.8,
      stock: 15,
      isNew: true,
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
    },
  
    {
      id: 2,
      slug: "4k-ultra-dome-camera",
      name: "4K Ultra HD Dome Camera",
      description:
        "Ultra HD 4K dome camera designed for commercial surveillance with wide-angle coverage.",
      price: 499,
      originalPrice: 549,
      images: [
        "/images/dome-camera.webp",
        "/images/pole-camera.webp",
      ],
      brand: {
        name: "TechGuard",
        logo: "/images/brands/hikvision.png",
      },
      category: "Dome Camera",
      rating: 4.9,
      stock: 8,
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
    },
  
    {
      id: 3,
      slug: "wireless-smart-security-cam",
      name: "Wireless Smart Security Camera",
      description:
        "Compact wireless security camera with real-time alerts and cloud storage integration.",
      price: 199,
      images: [
        "/images/wireless-camera.webp",
        "/images/dome-camera.webp",
      ],
      brand: {
        name: "SecureTech",
        logo: "/images/brands/dahua.png",
      },
      category: "Wireless Camera",
      rating: 4.6,
      stock: 22,
      isNew: true,
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
    },
  
    {
      id: 4,
      slug: "ai-motion-detection-camera",
      name: "AI Motion Detection Camera",
      description:
        "Advanced AI-powered camera with facial recognition and smart tracking.",
      price: 399,
      originalPrice: 449,
      images: [
        "/images/pole-camera.webp",
        "/images/bullet-camera.webp",
      ],
      brand: {
        name: "VisionPro",
        logo: "/images/brands/honeywell.png",
      },
      category: "AI Camera",
      rating: 4.7,
      stock: 10,
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
    },
  
    {
      id: 5,
      slug: "outdoor-bullet-security-camera",
      name: "Outdoor Bullet Security Camera",
      description:
        "Durable outdoor bullet camera built for harsh weather and long-distance monitoring.",
      price: 259,
      originalPrice: 299,
      images: [
        "/images/bullet-camera.webp",
        "/images/dome-camera.webp",
      ],
      brand: {
        name: "SafeHome",
        logo: "/images/brands/cp-plus.png",
      },
      category: "Bullet Camera",
      rating: 4.5,
      stock: 18,
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
    },
  ];