"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface Filters {
  categories: FilterOption[];
  brands: FilterOption[];
  sizes: FilterOption[];
  priceRanges: FilterOption[];
}

export default function ShopFilters({ filters, params }: { filters: Filters; params: any }) {
  return (
    <div className="space-y-4 p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 sticky top-6 lg:top-24 z-10 lg:w-64">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <h3 className="text-lg font-medium bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Filters
        </h3>
        <a href="/shop" className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1 rounded-full hover:bg-slate-100 transition-all">
          Clear
        </a>
      </div>

      <FilterSection title="Category" options={filters.categories} active={params.category} param="category" />
      <FilterSection title="Brand" options={filters.brands.slice(0, 8)} active={params.brand} param="brand" />
      <FilterSection title="Size" options={filters.sizes} active={params.size} param="size" isGrid />
      
      {/* <PriceRangeSlider active={params.price} /> */}
    </div>
  );
}

function FilterSection({ 
  title, 
  options, 
  active, 
  param, 
  isGrid = false 
}: { 
  title: string; 
  options: any[]; 
  active?: string; 
  param: string; 
  isGrid?: boolean 
}) {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm uppercase tracking-wider text-slate-600 px-1">
        {title}
      </h4>
      <div className={isGrid ? "grid grid-cols-3 gap-1.5" : "space-y-1.5"}>
        {options.map((option: any) => (
          <a
            key={option.value}
            href={`?${param}=${option.value}`}
            className={`block px-3 py-2 rounded-lg text-xs font-medium transition-all group hover:shadow-md duration-200 ${
              active === option.value
                ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg border border-blue-400 scale-[1.02]'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm border border-slate-100'
            }`}
          >
            <span className="truncate">{option.label}</span>
            {option.count > 0 && (
              <span className={`ml-1 text-xs opacity-70 ${
                active === option.value ? 'text-blue-100' : 'group-hover:text-slate-500 text-slate-400'
              }`}>
                ({option.count})
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

// 🔥 FIXED: PROPERLY DEBOUNCED SLIDER (NO MORE SPAM!)
function PriceRangeSlider({ active }: { active?: string }) {
  const [priceValue, setPriceValue] = useState(1000);
  const [debouncedPrice, setDebouncedPrice] = useState(1000);
  const [isDragging, setIsDragging] = useState(false);
  const [shouldUpdateUrl, setShouldUpdateUrl] = useState(true); // 🔑 NEW: Control URL updates
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🔥 FIXED DEBOUNCE: Only update debounced value when NOT dragging
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only debounce if not actively dragging
    if (!isDragging) {
      timeoutRef.current = setTimeout(() => {
        setDebouncedPrice(priceValue);
      }, 300); // Increased to 300ms for better UX
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [priceValue, isDragging]);

  // 🔥 FIXED URL UPDATE: Only when shouldUpdateUrl is true AND debounced value changes
  useEffect(() => {
    if (!shouldUpdateUrl) return;

    const priceParam = getPriceParam(debouncedPrice);
    const currentParams = new URLSearchParams(searchParams.toString());
    
    if (debouncedPrice === 0) {
      currentParams.delete('price');
    } else {
      currentParams.set('price', priceParam);
    }

    const queryString = currentParams.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [debouncedPrice, shouldUpdateUrl, router, pathname, searchParams]);

  // Set initial slider from URL
  useEffect(() => {
    if (active) {
      let initialValue = 1000;
      switch (active) {
        case 'under-500': initialValue = 400; break;
        case '500-1000': initialValue = 800; break;
        case '1000-2000': initialValue = 1500; break;
        case '2000+': initialValue = 3000; break;
      }
      setPriceValue(initialValue);
      setDebouncedPrice(initialValue);
    } else {
      setPriceValue(1000);
      setDebouncedPrice(1000);
    }
  }, [active]);

  // 🔥 FIXED: Slider interaction handlers
  const handleSliderMove = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const sliderWidth = rect.width;
    const clickX = Math.max(0, Math.min(clientX - rect.left, sliderWidth));
    const percentage = clickX / sliderWidth;
    const newValue = Math.round(percentage * 5000);
    
    setPriceValue(newValue);
    // Disable URL updates during drag
    setShouldUpdateUrl(false);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleSliderMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleSliderMove(e.touches[0].clientX);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleSliderMove(e.clientX);
    }
  }, [isDragging, handleSliderMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && e.touches.length > 0) {
      e.preventDefault();
      handleSliderMove(e.touches[0].clientX);
    }
  }, [isDragging, handleSliderMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setShouldUpdateUrl(true); // 🔑 Re-enable URL updates when done dragging
  }, []);

  // 🔥 FIXED: Event listeners cleanup
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp, { passive: false });
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp]);

  const getPriceParam = (value: number): string => {
    if (value <= 500) return 'under-500';
    if (value <= 1000) return '500-1000';
    if (value <= 2000) return '1000-2000';
    return '2000+';
  };

  const getPriceLabel = (value: number): string => {
    if (value <= 500) return 'Under ₹500';
    if (value <= 1000) return '₹500 - ₹1K';
    if (value <= 2000) return '₹1K - ₹2K';
    return '₹2K+';
  };

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm uppercase tracking-wider text-slate-600 px-1">
        Price Range
      </h4>
      
      <div className="space-y-3">
        <div 
          ref={sliderRef}
          className="relative h-2 bg-slate-200/80 rounded-full shadow-inner cursor-pointer group hover:bg-slate-300/80 transition-all duration-200 touch-manipulation select-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div 
            className="absolute top-0 h-2 bg-linear-to-r from-emerald-500 via-emerald-600 to-teal-600 rounded-full shadow-md transition-all duration-300"
            style={{ width: `${Math.min((priceValue / 5000) * 100, 100)}%` }}
          />
          
          <div 
            className={`absolute top-[-5px] w-4.5 h-4.5 bg-linear-to-r from-emerald-500 to-emerald-600 rounded-full shadow-lg border-3 border-white ring-2 ring-emerald-500/50 transform transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-125 hover:shadow-xl group-hover:scale-110 ${isDragging ? 'scale-130 shadow-2xl ring-emerald-500/75 !ring-4' : ''}`}
            style={{ left: `calc(${Math.min((priceValue / 5000) * 100, 100)}% - 7px)` }}
          />
        </div>

        <div className="text-center">
          <span className="text-sm font-semibold text-slate-700 bg-white/95 px-3 py-1.5 rounded-lg shadow-md border border-slate-200/50 backdrop-blur-sm inline-block">
            Max ₹{priceValue.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="pt-1">
        <div className="text-xs text-slate-500 text-center font-medium">
          {getPriceLabel(priceValue)}
        </div>
        {active && (
          <div className="text-xs text-emerald-600 text-center font-semibold mt-1 bg-emerald-50/80 px-2 py-1 rounded-md border border-emerald-200/50 shadow-sm">
            Filter Active
          </div>
        )}
      </div>
    </div>
  );
}