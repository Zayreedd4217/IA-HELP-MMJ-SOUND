import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";
// @ts-ignore
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";

/**
 * Design: Cyberpunk Edition - Share Card Generator
 * - Generates a visual card for sharing on social media
 * - Colors: #FF00FF (Magenta) + #00FFFF (Cyan) on black
 * - Includes download and copy-to-clipboard functionality
 * - Now includes a functional QR Code
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

  const trackShareUrl = `${window.location.origin}?track=${track.id}`;

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#000000",
        scale: 2,
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${track.title.replace(/\s+/g, "_")}_share_card.png`;
      link.click();
    } catch (error) {
      console.error("Error downloading card:", error);
    }
  };

  const copyCardLink = () => {
    navigator.clipboard.writeText(trackShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Card Preview */}
      <div
        ref={cardRef}
        className="border-4 border-[#FF00FF] shadow-[0_0_30px_#FF00FF] bg-black p-12 text-center max-w-2xl mx-auto"
        style={{
          aspectRatio: "1/1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div className="text-[#FF00FF] text-5xl font-bold mb-6">🎵 NEW TRACK 🎵</div>
          <h2 className="text-[#00FFFF] text-4xl font-bold mb-4 break-words">
            {track.title}
          </h2>
          <p className="text-[#FF00FF] text-2xl mb-8">by {track.author || "Artist"}</p>

          <div className="border-t-2 border-[#00FFFF] my-8"></div>

          <p className="text-[#00FFFF] text-xl font-bold mb-8">
            Listen on Music Maker Jam
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-4 rounded">
            <QRCodeSVG
              value={trackShareUrl}
              size={150}
              level="H"
              includeMargin={true}
              fgColor="#000000"
              bgColor="#FFFFFF"
            />
          </div>
        </div>

        <p className="text-[#FF00FF] text-lg font-bold">
          MMJ Helper - Cyberpunk Edition
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <Button
          onClick={downloadCard}
          className="bg-[#FF00FF] hover:bg-[#FF00FF]/80 text-black font-bold py-3 px-6"
        >
          <Download className="mr-2 h-4 w-4" />
          Télécharger la Carte
        </Button>
        <Button
          onClick={copyCardLink}
          className="bg-[#00FFFF] hover:bg-[#00FFFF]/80 text-black font-bold py-3 px-6"
        >
          <Copy className="mr-2 h-4 w-4" />
          {copied ? "Copié !" : "Copier le Lien"}
        </Button>
      </div>
    </div>
  );
}
