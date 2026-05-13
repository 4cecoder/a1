import Navbar from "./components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Scissors, MapPin, Phone, Clock, Star,
  ChevronRight, User
} from "lucide-react";

const SERVICES = [
  { name: "Classic Cut", price: "$25", desc: "Clean, sharp, timeless.", popular: false },
  { name: "Fade", price: "$30", desc: "Low, mid, or high — dialed in.", popular: true },
  { name: "Beard Trim", price: "$15", desc: "Lined up and looking right.", popular: false },
  { name: "Cut + Beard", price: "$40", desc: "The full treatment.", popular: true },
  { name: "Hot Towel Shave", price: "$35", desc: "Old school. The real deal.", popular: false },
  { name: "Kid's Cut", price: "$18", desc: "Ages 12 and under.", popular: false },
];

const BARBERS = [
  { name: "Marcus", title: "Master Barber", years: "12 yrs", specialty: "Fades & Tapers" },
  { name: "DeShawn", title: "Senior Barber", years: "8 yrs", specialty: "Beards & Lineups" },
  { name: "Ray", title: "Barber", years: "4 yrs", specialty: "Classic Cuts" },
];

const HOURS = [
  ["Mon – Fri", "9AM – 7PM"],
  ["Saturday", "9AM – 6PM"],
  ["Sunday", "Closed"],
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section id="hero" className="min-h-screen flex items-center pt-16"
        style={{ background: "linear-gradient(135deg, #0a0a0a 55%, #150000 100%)" }}>
        <div className="max-w-5xl mx-auto px-6 py-24 w-full">
          <div className="flex items-start gap-5 mb-8">
            <div className="pole-stripe h-24 mt-1 shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="border-[#C9A84C]/40 text-[#C9A84C] text-[10px] tracking-[0.2em] rounded-none font-sans">
                  EST. 2010
                </Badge>
                <Badge variant="outline" className="border-[#333] text-[#666] text-[10px] tracking-[0.15em] rounded-none font-sans">
                  COLUMBIA, SC
                </Badge>
              </div>
              <h1 className="text-[clamp(52px,10vw,100px)] font-bold leading-none mb-6"
                style={{ fontFamily: "Georgia, serif" }}>
                A1<br />
                <span style={{ color: "#C9A84C" }}>CUTS</span>
              </h1>
            </div>
          </div>

          <p className="text-[#666] text-lg max-w-md leading-relaxed font-sans mb-10">
            Premium cuts. Classic craft. Walk in looking good, walk out looking great.
          </p>

          <div className="flex gap-4 flex-wrap">
            <a href="tel:8037832993"
              className={cn(buttonVariants({ size: "lg" }), "bg-[#C9A84C] hover:bg-[#a8863a] text-black font-bold tracking-[0.15em] text-xs rounded-none px-8 no-underline")}>
              <Phone size={14} className="mr-2" />
              CALL TO BOOK
            </a>
            <a href="#services"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-[#333] text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C] tracking-[0.15em] text-xs rounded-none px-8 no-underline")}>
              VIEW SERVICES
              <ChevronRight size={14} className="ml-2" />
            </a>
          </div>

          <div className="flex gap-12 mt-16 pt-10 border-t border-[#1a1a1a]">
            {[["10+", "Years Open"], ["3", "Expert Barbers"], ["5★", "Rated"]].map(([val, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "Georgia, serif" }}>{val}</div>
                <div className="text-[#555] text-xs tracking-[0.15em] uppercase font-sans mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-[#0f0f0f] border-y border-[#1f1f1f]">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="flex items-center gap-3 mb-2">
            <Scissors size={14} className="text-[#C9A84C]" />
            <span className="text-[#C9A84C] text-[10px] tracking-[0.25em] uppercase font-sans">What We Do</span>
          </div>
          <h2 className="text-4xl font-bold mb-12" style={{ fontFamily: "Georgia, serif" }}>Services</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1f1f1f]">
            {SERVICES.map(s => (
              <Card key={s.name} className="bg-[#0f0f0f] rounded-none border-0 hover:bg-[#141414] transition-colors group">
                <CardContent className="p-7">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#C9A84C] transition-colors"
                      style={{ fontFamily: "Georgia, serif" }}>
                      {s.name}
                    </h3>
                    {s.popular && (
                      <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30 text-[9px] tracking-[0.15em] rounded-none font-sans">
                        POPULAR
                      </Badge>
                    )}
                  </div>
                  <p className="text-[#555] text-sm font-sans mb-4">{s.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl text-[#C9A84C]" style={{ fontFamily: "Georgia, serif" }}>{s.price}</span>
                    <Star size={12} className="text-[#333] group-hover:text-[#C9A84C] transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* BARBERS */}
      <section id="barbers" className="bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="flex items-center gap-3 mb-2">
            <User size={14} className="text-[#C9A84C]" />
            <span className="text-[#C9A84C] text-[10px] tracking-[0.25em] uppercase font-sans">The Team</span>
          </div>
          <h2 className="text-4xl font-bold mb-12" style={{ fontFamily: "Georgia, serif" }}>Your Barbers</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {BARBERS.map(b => (
              <Card key={b.name} className="bg-[#111] border-[#1f1f1f] rounded-none hover:border-[#C9A84C]/40 transition-colors group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border-2 border-[#C9A84C]/30 group-hover:border-[#C9A84C] transition-colors mx-auto mb-5 flex items-center justify-center">
                    <Scissors size={20} className="text-[#C9A84C]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "Georgia, serif" }}>{b.name}</h3>
                  <p className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-sans mb-1">{b.title}</p>
                  <Separator className="bg-[#1f1f1f] my-4" />
                  <p className="text-[#555] text-xs font-sans">{b.specialty}</p>
                  <p className="text-[#333] text-xs font-sans mt-1">{b.years} experience</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-[#0f0f0f] border-t border-[#1f1f1f]">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="flex items-center gap-3 mb-2">
            <MapPin size={14} className="text-[#C9A84C]" />
            <span className="text-[#C9A84C] text-[10px] tracking-[0.25em] uppercase font-sans">Find Us</span>
          </div>
          <h2 className="text-4xl font-bold mb-12" style={{ fontFamily: "Georgia, serif" }}>Contact & Hours</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-[#111] border-[#1f1f1f] rounded-none">
              <CardContent className="p-7">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={14} className="text-[#C9A84C]" />
                  <span className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-sans">Location</span>
                </div>
                <p className="text-white text-base leading-relaxed mb-3" style={{ fontFamily: "Georgia, serif" }}>
                  1314 Leesburg Rd #D<br />Columbia, SC 29209
                </p>
                <a href="https://maps.google.com/?q=1314+Leesburg+Rd+%23D+Columbia+SC+29209"
                  target="_blank" rel="noopener noreferrer"
                  className="text-[#555] hover:text-[#C9A84C] text-xs font-sans tracking-wide transition-colors no-underline flex items-center gap-1">
                  Get Directions <ChevronRight size={12} />
                </a>
              </CardContent>
            </Card>

            <Card className="bg-[#111] border-[#1f1f1f] rounded-none">
              <CardContent className="p-7">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={14} className="text-[#C9A84C]" />
                  <span className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-sans">Hours</span>
                </div>
                <div className="space-y-3">
                  {HOURS.map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className="text-[#666] text-sm font-sans">{day}</span>
                      <span className={`text-sm font-sans ${hours === "Closed" ? "text-[#444]" : "text-white"}`}>{hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#111] border-[#1f1f1f] rounded-none">
              <CardContent className="p-7">
                <div className="flex items-center gap-2 mb-4">
                  <Phone size={14} className="text-[#C9A84C]" />
                  <span className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-sans">Book</span>
                </div>
                <p className="text-[#555] text-sm font-sans leading-relaxed mb-6">
                  Walk-ins welcome.<br />Appointments recommended.
                </p>
                <a href="tel:8037832993"
                  className={cn(buttonVariants(), "w-full bg-[#C9A84C] hover:bg-[#a8863a] text-black font-bold tracking-[0.15em] text-xs rounded-none no-underline justify-center")}>
                  <Phone size={13} className="mr-2" />
                  (803) 783-2993
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="pole-stripe h-5" />
            <Scissors size={12} className="text-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs tracking-[0.2em] font-sans">A1 CUTS</span>
          </div>
          <p className="text-[#333] text-xs font-sans tracking-wide">© 2025 A1 Cuts · Columbia, SC</p>
        </div>
      </footer>
    </>
  );
}
