import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

/**
 * Design: Cyberpunk Edition - Copy Post Text
 * - Generates optimized social media post text
 * - Includes official MMJ URL, author name (no spaces), and hashtags
 * - Funnel: MMJ Helper → Click Share → Post TikTok/Insta → Traffic to MMJ Official → Real Likes
 * - Colors: #FF00FF (Magenta) + #00FFFF (Cyan)
 */

interface Track {
  id: string;
  title: string;
  mmjUrl: string;
  author?: string;
}

interface CopyPostTextProps {
  track: Track;
}

export default function CopyPostText({ track }: CopyPostTextProps) {
  const [copied, setCopied] = useState<string | null>(null);

  // Generate post text with official MMJ URL and formatted author
  const generatePostText = (platform: "tiktok" | "instagram" | "generic") => {
    const authorHandle = (track.author || "Artist").replace(/\s+/g, "");
    const baseText = `🔥 Nouveau son "${track.title}" par ${authorHandle} 🔥\n\nDispo sur Music Maker Jam 👇\n${track.mmjUrl}\n\n#MusicMakerJam #NewMusic #MMJ #${authorHandle}`;

    switch (platform) {
      case "tiktok":
        return `${baseText} #Beatmaker #Prod #FYP #PourToi #Music`;
      case "instagram":
        return `${baseText} #Beatmaker #Producer #MusicProduction #IndieMusic`;
      default:
        return baseText;
    }
  };

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  const tiktokText = generatePostText("tiktok");
  const instagramText = generatePostText("instagram");
  const genericText = generatePostText("generic");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#FF00FF] mb-2">
          Partage Optimisé pour les Réseaux
        </h2>
        <p className="text-[#00FFFF]">
          Copie et colle directement sur TikTok, Instagram ou partout ailleurs
        </p>
      </div>

      {/* TikTok Post */}
      <div className="p-6 border-2 border-[#00FFFF] bg-black/50 shadow-[0_0_15px_#00FFFF]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#FF00FF]">🎵 TikTok</h3>
          <span className="text-xs text-[#00FFFF] bg-black/50 px-2 py-1 rounded">
            Optimisé pour FYP
          </span>
        </div>

        <div className="bg-black border-2 border-[#FF00FF] p-4 rounded mb-4 min-h-[120px]">
          <p className="text-[#00FFFF] text-sm whitespace-pre-wrap break-words">
            {tiktokText}
          </p>
        </div>

        <Button
          onClick={() => copyToClipboard(tiktokText, "tiktok")}
          className={`w-full font-bold transition-all ${
            copied === "tiktok"
              ? "bg-[#00FFFF] text-black"
              : "bg-[#FF00FF] hover:bg-[#FF00FF]/80 text-black"
          }`}
        >
          {copied === "tiktok" ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copié !
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copier pour TikTok
            </>
          )}
        </Button>
      </div>

      {/* Instagram Post */}
      <div className="p-6 border-2 border-[#FF00FF] bg-black/50 shadow-[0_0_15px_#FF00FF]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#00FFFF]">📸 Instagram</h3>
          <span className="text-xs text-[#FF00FF] bg-black/50 px-2 py-1 rounded">
            Avec hashtags
          </span>
        </div>

        <div className="bg-black border-2 border-[#00FFFF] p-4 rounded mb-4 min-h-[120px]">
          <p className="text-[#FF00FF] text-sm whitespace-pre-wrap break-words">
            {instagramText}
          </p>
        </div>

        <Button
          onClick={() => copyToClipboard(instagramText, "instagram")}
          className={`w-full font-bold transition-all ${
            copied === "instagram"
              ? "bg-[#00FFFF] text-black"
              : "bg-[#FF00FF] hover:bg-[#FF00FF]/80 text-black"
          }`}
        >
          {copied === "instagram" ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copié !
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copier pour Instagram
            </>
          )}
        </Button>
      </div>

      {/* Generic Post */}
      <div className="p-6 border-2 border-[#00FFFF] bg-black/50 shadow-[0_0_15px_#00FFFF]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#FF00FF]">🌐 Partout</h3>
          <span className="text-xs text-[#00FFFF] bg-black/50 px-2 py-1 rounded">
            Version générique
          </span>
        </div>

        <div className="bg-black border-2 border-[#FF00FF] p-4 rounded mb-4 min-h-[120px]">
          <p className="text-[#00FFFF] text-sm whitespace-pre-wrap break-words">
            {genericText}
          </p>
        </div>

        <Button
          onClick={() => copyToClipboard(genericText, "generic")}
          className={`w-full font-bold transition-all ${
            copied === "generic"
              ? "bg-[#00FFFF] text-black"
              : "bg-[#FF00FF] hover:bg-[#FF00FF]/80 text-black"
          }`}
        >
          {copied === "generic" ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copié !
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copier le Texte
            </>
          )}
        </Button>
      </div>

      {/* Funnel Info */}
      <div className="p-4 border-2 border-[#FF00FF] bg-black/50 rounded text-center">
        <p className="text-[#00FFFF] text-sm">
          <span className="text-[#FF00FF] font-bold">Funnel Complet:</span> MMJ
          Helper → Clic Partage → Post TikTok/Insta → Trafic MMJ Officiel →
          Vrais Likes
        </p>
      </div>
    </div>
  );
}
