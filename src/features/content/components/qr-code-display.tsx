"use client";

import { SmartphoneIcon } from "lucide-react";

interface QRCodeDisplayProps {
  url?: string;
  title: string;
  body?: string;
  bgType?: string;
  bgValue?: string;
}

export function QRCodeDisplay({
  url = "https://screenhub.com",
  title,
  body,
  bgType = "gradient",
  bgValue,
}: QRCodeDisplayProps) {
  const targetUrl = url?.trim() || "https://screenhub.com";
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(targetUrl)}&color=000000&bgcolor=ffffff&margin=15`;

  const getBackgroundStyle = (): React.CSSProperties => {
    if (bgType === "color") {
      return { backgroundColor: bgValue || "#0a0f24" };
    }
    if (bgType === "gradient") {
      return { background: bgValue || "linear-gradient(135deg, #0a0f24 0%, #050811 50%, #120e29 100%)" };
    }
    if (bgType === "image" && bgValue && (bgValue.startsWith("http") || bgValue.startsWith("/"))) {
      return { backgroundImage: `url(${bgValue})`, backgroundSize: "cover", backgroundPosition: "center" };
    }
    return { background: "linear-gradient(135deg, #0a0f24 0%, #050811 50%, #120e29 100%)" };
  };

  const getTitleFontSize = (text: string) => {
    const len = (text || "").length;
    if (len > 40) return "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-snug";
    if (len > 20) return "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight";
    return "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight";
  };

  const getBodyFontSize = (text: string) => {
    const len = (text || "").length;
    if (len > 120) return "text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-relaxed";
    if (len > 60) return "text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-relaxed";
    return "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed";
  };

  return (
    <div
      className="w-full h-full text-white flex items-center justify-center p-6 sm:p-10 md:p-16 relative overflow-hidden select-none"
      style={getBackgroundStyle()}
    >
      {/* Dark overlay backdrop if background is image */}
      {bgType === "image" && bgValue && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-0" />
      )}

      {/* Subtle ambient glow sphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-primary/20 blur-[130px] pointer-events-none z-0" />

      {/* Harmonious Balanced Container for Signage Displays */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-16 px-4 sm:px-8 max-h-full overflow-hidden">
        {/* QR Code Card (Large, High-impact Signage Scanner) */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="relative group">
            {/* Vibrant Glow Ring */}
            <div className="absolute -inset-2.5 rounded-3xl bg-gradient-to-r from-primary via-amber-400 to-emerald-400 opacity-75 blur-md group-hover:opacity-100 transition-opacity" />

            <div className="relative bg-white p-5 sm:p-7 md:p-9 rounded-3xl shadow-2xl flex flex-col items-center justify-center">
              <img
                src={qrCodeApiUrl}
                alt={`Código QR: ${targetUrl}`}
                className="size-52 sm:size-72 md:size-84 lg:size-96 xl:size-[400px] object-contain rounded-2xl"
              />
              <div className="mt-4 sm:mt-5 inline-flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-slate-950 text-amber-300 text-xs sm:text-sm md:text-base font-black uppercase tracking-widest shadow-xl">
                <SmartphoneIcon className="size-4 sm:size-5" />
                <span>Escanea Aquí</span>
              </div>
            </div>
          </div>
        </div>

        {/* Text Details (Clean Spacing & Signage Auto-scaling) */}
        <div className="flex-1 flex flex-col justify-center space-y-4 sm:space-y-6 text-center lg:text-left min-w-0 max-h-full overflow-hidden">
          <h1 className={`${getTitleFontSize(title)} text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] tracking-tight break-words font-black`}>
            {title || "Escanea para más información"}
          </h1>

          {body ? (
            <p className={`${getBodyFontSize(body)} text-amber-200/95 bg-black/50 border-2 border-white/20 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl backdrop-blur-2xl shadow-2xl drop-shadow-lg overflow-hidden text-ellipsis line-clamp-4`}>
              "{body}"
            </p>
          ) : (
            <p className="text-base sm:text-xl md:text-2xl font-medium text-white/80 leading-relaxed max-w-2xl">
              Apunta la cámara de tu smartphone al código QR para acceder al contenido interactivo de forma instantánea.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
