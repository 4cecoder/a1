import Image from "next/image";

const MOSAIC_IMAGES = [
  {
    src: "https://images.pexels.com/photos/2076940/pexels-photo-2076940.jpeg?auto=compress&w=640&h=640&fit=crop",
    alt: "Close-up of a professional fade cut",
    priority: true,
  },
  {
    src: "https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&w=640&h=640&fit=crop",
    alt: "Barber working on a client",
    priority: false,
  },
  {
    src: "https://images.pexels.com/photos/897262/pexels-photo-897262.jpeg?auto=compress&w=640&h=640&fit=crop",
    alt: "Classic barbershop chair",
    priority: false,
  },
];

export function HeroMosaic() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: "0 0 auto", width: 320, position: "relative" }}>
      {/* Overlay div for gradient effect */}
      <div
        data-testid="hero-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(8,8,8,0.12) 0%, rgba(8,8,8,0.72) 100%)",
          zIndex: 1,
          pointerEvents: "none",
          borderRadius: 4,
        }}
      />
      {MOSAIC_IMAGES.map((img) => (
        <div key={img.src} style={{ position: "relative", width: 320, height: 320, flexShrink: 0 }}>
          <Image
            src={img.src}
            alt={img.alt}
            width={320}
            height={320}
            priority={img.priority}
            sizes="320px"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>
      ))}
    </div>
  );
}
