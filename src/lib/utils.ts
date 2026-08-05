import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type VideoPlatform = "auto" | "youtube" | "gdrive" | "vimeo" | "dropbox" | "onedrive" | "direct";

export interface FormattedVideoResult {
  platform: VideoPlatform;
  isIframe: boolean;
  url: string;
}

export function formatVideoUrl(url: string, platformHint: VideoPlatform = "auto", muted: boolean = false): FormattedVideoResult {
  if (!url) return { platform: "direct", isIframe: false, url: "" };

  const cleanUrl = url.trim();
  const muteParam = muted ? "1" : "0";

  // 1. YouTube Detection
  const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1] && (platformHint === "auto" || platformHint === "youtube")) {
    const ytId = ytMatch[1];
    return {
      platform: "youtube",
      isIframe: true,
      url: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=${muteParam}&controls=0&loop=1&playlist=${ytId}&modestbranding=1&rel=0&enablejsapi=1&playsinline=1`,
    };
  }

  // 2. Google Drive Detection
  const gdMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (gdMatch && gdMatch[1] && (platformHint === "auto" || platformHint === "gdrive")) {
    const fileId = gdMatch[1];
    return {
      platform: "gdrive",
      isIframe: true,
      url: `https://drive.google.com/file/d/${fileId}/preview`,
    };
  }

  // 3. Vimeo Detection
  const vimeoMatch = cleanUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1] && (platformHint === "auto" || platformHint === "vimeo")) {
    const vimeoId = vimeoMatch[1];
    return {
      platform: "vimeo",
      isIframe: true,
      url: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&muted=${muteParam}&background=0`,
    };
  }

  // 4. Dropbox Detection
  if (cleanUrl.includes("dropbox.com") || platformHint === "dropbox") {
    const directDropbox = cleanUrl
      .replace("dl=0", "raw=1")
      .replace("dl=1", "raw=1")
      .replace("www.dropbox.com", "dl.dropboxusercontent.com");
    return {
      platform: "dropbox",
      isIframe: false,
      url: directDropbox,
    };
  }

  // 5. OneDrive / SharePoint
  if (cleanUrl.includes("onedrive.live.com") || cleanUrl.includes("sharepoint.com") || platformHint === "onedrive") {
    const embedOneDrive = cleanUrl.includes("embed") ? cleanUrl : cleanUrl.replace("/view.aspx", "/embed.aspx");
    return {
      platform: "onedrive",
      isIframe: true,
      url: embedOneDrive,
    };
  }

  // 6. Direct Video Link (.mp4, .webm, .mov, etc)
  return {
    platform: "direct",
    isIframe: false,
    url: cleanUrl,
  };
}

export function formatGoogleDriveUrl(url: string) {
  const result = formatVideoUrl(url, "gdrive");
  return {
    isGoogleDrive: result.platform === "gdrive",
    streamUrl: result.url,
    embedUrl: result.url,
  };
}
