import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Heart } from "lucide-react";
import ShareCardGenerator from "@/components/ShareCardGenerator";
import CopyPostText from "@/components/CopyPostText";
import CommentSection from "@/components/CommentSection";
import { Track } from "@/hooks/useTrackAPI";
import { useAuth } from "@/hooks/useAuth";
import { useTrackAPI } from "@/hooks/useTrackAPI";

/**
 * Design: Cyberpunk Edition - Track Detail Page
 * - Displays individual track with sharing options
 * - Integrates ShareCardGenerator for visual card creation
 * - Integrates CopyPostText for social media copy generation
 * - Includes comment section
 */

interface TrackPageProps {
  track: Track;
  onBack: () => void;
}

export default function TrackPage({ track, onBack }: TrackPageProps) {
  const [showShareCard, setShowShareCard] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(track);
  const { likeTrack, unlikeTrack } = useTrackAPI();
  const { getToken, isAuthenticated } = useAuth();

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert("Vous devez être connecté pour aimer un morceau");
      return;
    }

    const token = getToken();
    if (isLiked) {
      const updated = await unlikeTrack(currentTrack.id, token || undefined);
      if (updated) {
        setCurrentTrack(updated);
        setIsLiked(false);
      }
    } else {
      const updated = await likeTrack(currentTrack.id, token || undefined);
      if (updated) {
        setCurrentTrack(updated);
        setIsLiked(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b-2 border-[#FF00FF] bg-black/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-[#00FFFF] hover:bg-[#FF00FF]/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <div className="text-2xl font-bold">
              <span className="text-[#FF00FF]">♫</span>
              <span className="text-[#00FFFF] ml-2">MMJ Helper</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Track Info */}
        <section className="mb-12 p-6 border-2 border-[#FF00FF] shadow-[0_0_20px_#FF00FF] bg-black/50">
          <h1 className="text-4xl font-bold text-[#FF00FF] mb-2">
            {currentTrack.title}
          </h1>
          <p className="text-[#00FFFF] text-lg mb-4">
            Par {currentTrack.author || "Artiste"}
          </p>
          {currentTrack.description && (
            <p className="text-gray-400 mb-4">{currentTrack.description}</p>
          )}
          <p className="text-gray-400 text-sm mb-6">
            ID: {currentTrack.id} | Likes: {currentTrack.likes}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={() => window.open(currentTrack.mmjUrl, "_blank")}
              className="bg-[#00FFFF] hover:bg-[#00FFFF]/80 text-black font-bold"
            >
              Écouter sur Music Maker Jam
            </Button>
            <Button
              onClick={handleLike}
              className={`${
                isLiked
                  ? "bg-[#FF00FF]/50 text-black"
                  : "bg-[#FF00FF] hover:bg-[#FF00FF]/80 text-black"
              } font-bold`}
            >
              <Heart className="mr-2 h-4 w-4" />
              {isLiked ? "Aimé" : "Aimer"}
            </Button>
            <Button
              onClick={() => setShowShareCard(!showShareCard)}
              className="bg-[#00FFFF] hover:bg-[#00FFFF]/80 text-black font-bold"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Générer Carte de Partage
            </Button>
          </div>
        </section>

        {/* Share Card Generator */}
        {showShareCard && (
          <section className="mb-12">
            <ShareCardGenerator track={currentTrack} />
          </section>
        )}

        {/* Copy Post Text - Funnel de Partage */}
        <section className="mb-12">
          <CopyPostText track={currentTrack} />
        </section>

        {/* Comments Section */}
        <section className="mb-12">
          <CommentSection trackId={currentTrack.id} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#FF00FF] mt-12 py-6 text-center text-gray-500">
        <p>
          Made with <span className="text-[#FF00FF]">♫</span> by MMJ Helper
        </p>
      </footer>
    </div>
  );
}
