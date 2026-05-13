"use client";
import { useState } from "react";
import { Scissors, Menu, X, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = ["Services", "Barbers", "Contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 no-underline">
          <div className="pole-stripe h-8" />
          <Scissors size={16} className="text-[#C9A84C]" />
          <span className="font-bold text-[#C9A84C] tracking-[0.2em] text-lg" style={{ fontFamily: "Georgia, serif" }}>
            A1 CUTS
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="text-[#888] hover:text-[#C9A84C] transition-colors text-xs tracking-[0.2em] uppercase no-underline font-sans">
              {l}
            </a>
          ))}
          <a href="tel:8037832993"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }),
              "border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black tracking-[0.15em] text-xs rounded-none no-underline")}>
            <Phone size={12} className="mr-1" /> Book Now
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-[#C9A84C] bg-transparent border-none cursor-pointer">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#111] border-t border-[#1f1f1f] px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
              className="text-[#888] hover:text-[#C9A84C] text-xs tracking-[0.2em] uppercase no-underline font-sans transition-colors">
              {l}
            </a>
          ))}
          <a href="tel:8037832993" onClick={() => setOpen(false)}
            className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase no-underline font-sans">
            BOOK NOW
          </a>
        </div>
      )}
    </nav>
  );
}
