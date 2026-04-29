import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";

/**
 * Design: Cyberpunk Edition - Share Card Generator
 * - Generates a visual card for sharing on social media
 * - Colors: #FF00FF (Magenta) + #00FFFF (Cyan) on black
 * - Includes download and copy-to-clipboard functionality
 */

interface Track {
  id: string;
  title: string;
  mmjUrl: string;
  author?: string;
}

interface ShareCardGeneratorProps {
  track: Track;
}

export default function ShareCardGenerator({ track }: ShareCardGeneratorProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const downloadCard = () => {
    if (!cardRef.current) return;

    // Convert card to image and download
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1080;

    // Background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = "#FF00FF";
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Glow effect
    ctx.strokeStyle = "#FF00FF";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.globalAlpha = 1;

    // Title
    ctx.fillStyle = "#FF00FF";
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🎵 NEW TRACK 🎵", canvas.width / 2, 150);

    // Track Title
    ctx.fillStyle = "#00FFFF";
    ctx.font = "bold 48px Arial";
    ctx.fillText(track.title, canvas.width / 2, 280);

    // Artist
    ctx.fillStyle = "#FF00FF";
    ctx.font = "36px Arial";
    ctx.fillText(`by ${track.author || "Artist"}`, canvas.width / 2, 380);

    // Divider
    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 450);
    ctx.lineTo(canvas.width - 100, 450);
    ctx.stroke();

    // CTA
    ctx.fillStyle = "#00FFFF";
    ctx.font = "bold 40px Arial";
    ctx.fillText("Listen on Music Maker Jam", canvas.width / 2, 580);

    // QR Code placeholder (simplified)
    ctx.fillStyle = "#FF00FF";
    ctx.fillRect(canvas.width / 2 - 100, 650, 200, 200);

    // Footer
    ctx.fillStyle = "#FF00FF";
    ctx.font = "24px Arial";
    ctx.fillText("MMJ Helper - Cyberpunk Edition", canvas.width / 2, 950);

    // Download
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${track.title.replace(/\s+/g, "_")}_share_card.png`;
    link.click();
  };

  const copyCardLink = () => {
    const cardUrl = `${window.location.origin}?track=${track.id}`;
    navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Card Preview */}
      <div
        ref={cardRef}
        className="border-2 border-[#FF00FF] shadow-[0_0_30px_#FF00FF] bg-black p-8 text-center"
      >
        <div className="text-[#FF00FF] text-4xl font-bold mb-4">🎵 NEW TRACK 🎵</div>
        <h2 className="text-[#00FFFF] text-3xl font-bold mb-2">{track.title}</h2>
        <p className="text-[#FF00FF] text-xl mb-6">by {track.author || "Artist"}</p>

        <div className="border-t-2 border-[#00FFFF] my-6"></div>

        <p className="text-[#00FFFF] text-lg font-bold mb-6">
          Listen on Music Maker Jam
        </p>

        <div className="bg-[#FF00FF] w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <span className="text-black text-sm font-bold">QR Code</span>
        </div>

        <p className="text-[#FF00FF] text-sm">
          MMJ Helper - Cyberpunk Edition
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <Button
          onClick={downloadCard}
          className="bg-[#FF00FF] hover:bg-[#FF00FF]/80 text-black font-bold"
        >
          <Download className="mr-2 h-4 w-4" />
          Télécharger la Carte
        </Button>
        <Button
          onClick={copyCardLink}
          className="bg-[#00FFFF] hover:bg-[#00FFFF]/80 text-black font-bold"
        >
          <Copy className="mr-2 h-4 w-4" />
          {copied ? "Copié !" : "Copier le Lien"}
        </Button>
      </div>
    </div>
  );
}
