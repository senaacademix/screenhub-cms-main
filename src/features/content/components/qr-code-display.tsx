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
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(targetUrl)}&color=000000&bgcolor=ffffff&margin=10`;

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
    if (len > 40) return "text-xs sm:text-sm md:text-base font-black leading-snug";
    if (len > 25) return "text-sm sm:text-base md:text-lg font-black leading-snug";
    return "text-base sm:text-xl md:text-2xl font-black leading-tight";
  };

  const getBodyFontSize = (text: string) => {
    const len = (text || "").length;
    if (len > 90) return "text-[10px] sm:text-xs font-medium leading-normal";
    return "text-xs sm:text-sm font-medium leading-relaxed";
  };

  return (
    <div
      className="w-full h-full text-white flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden select-none"
      style={getBackgroundStyle()}
    >
      {/* Dark overlay backdrop if background is image */}
      {bgType === "image" && bgValue && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-0" />
      )}

      {/* Subtle ambient glow sphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-72 rounded-full bg-primary/15 blur-3xl pointer-events-none z-0" />

      {/* Harmonious Balanced Container */}
      <div className="relative z-10 w-full max-w-3xl flex flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 max-h-full overflow-hidden">
        {/* QR Code Card (Compact, Refined & Elegant) */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="relative group">
            {/* Subtle Glow Ring */}
            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-primary via-amber-400 to-emerald-400 opacity-60 blur-sm group-hover:opacity-90 transition-opacity" />

            <div className="relative bg-white p-2.5 sm:p-3.5 rounded-2xl shadow-xl flex flex-col items-center justify-center">
              <img
                src={qrCodeApiUrl}
                alt={`Código QR: ${targetUrl}`}
                className="size-28 sm:size-36 md:size-44 object-contain rounded-lg"
              />
              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[10px] font-black uppercase tracking-wider shadow-sm">
                <SmartphoneIcon className="size-3" />
                <span>Escanea Aquí</span>
              </div>
            </div>
          </div>
        </div>

        {/* Text Details (Clean Spacing & Auto-scaling) */}
        <div className="flex-1 flex flex-col justify-center space-y-3 text-left min-w-0 max-h-full overflow-hidden">
          <h1 className={`${getTitleFontSize(title)} text-white drop-shadow-md tracking-tight break-words font-extrabold`}>
            {title || "Escanea para más información"}
          </h1>

          {body ? (
            <p className={`${getBodyFontSize(body)} text-amber-200/90 bg-black/40 border border-white/15 p-3 sm:p-4 rounded-xl backdrop-blur-md shadow-lg drop-shadow-sm overflow-hidden text-ellipsis line-clamp-4`}>
              "{body}"
            </p>
          ) : (
            <p className="text-[11px] sm:text-xs font-medium text-white/70 leading-relaxed">
              Apunta la cámara de tu smartphone al código QR para acceder a la URL y contenido interactivo de forma instantánea.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
