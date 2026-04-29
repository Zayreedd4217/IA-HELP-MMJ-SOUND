import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Music } from "lucide-react";
import { useTrackAPI, Track } from "@/hooks/useTrackAPI";
import { useAuth } from "@/hooks/useAuth";
import SearchFilters from "@/components/SearchFilters";

/**
 * Design: Cyberpunk Edition - Gallery Page
 * - Displays all saved tracks in a grid layout
 * - Shows likes count and allows users to like tracks
 * - Includes search and filter functionality
 * - Cyberpunk color scheme: Magenta + Cyan on black
 */

interface GalleryProps {
  onSelectTrack: (track: Track) => void;
}

export default function Gallery({ onSelectTrack }: GalleryProps) {
  const { getAllTracks, likeTrack, unlikeTrack, loading } = useTrackAPI();
  const { getToken, isAuthenticated } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [author, setAuthor] = useState("");
  const [sort, setSort] = useState("recent");

  useEffect(() => {
    fetchTracks();
  }, [search, author, sort]);

  const fetchTracks = async () => {
    const fetchedTracks = await getAllTracks(search, author, sort);
    setTracks(fetchedTracks);
  };

  const handleLike = async (trackId: string) => {
    if (!isAuthenticated) {
      alert("Vous devez être connecté pour aimer un morceau");
      return;
    }

    if (likedTracks.has(trackId)) {
      const token = getToken();
      const updatedTrack = await unlikeTrack(trackId, token || undefined);
      if (updatedTrack) {
        setTracks((prev) =>
          prev.map((t) => (t.id === trackId ? updatedTrack : t))
        );
        const newSet = new Set(likedTracks);
        newSet.delete(trackId);
        setLikedTracks(newSet);
      }
    } else {
      const token = getToken();
      const updatedTrack = await likeTrack(trackId, token || undefined);
      if (updatedTrack) {
        setTracks((prev) =>
          prev.map((t) => (t.id === trackId ? updatedTrack : t))
        );
        const newSet = new Set(likedTracks);
        newSet.add(trackId);
        setLikedTracks(newSet);
      }
    }
  };

  const handleReset = () => {
    setSearch("");
    setAuthor("");
    setSort("recent");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b-2 border-[#FF00FF] bg-black/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">
              <span className="text-[#FF00FF]">♫</span>
              <span className="text-[#00FFFF] ml-2">MMJ Gallery</span>
            </div>
            <div className="text-xs text-[#FF00FF]">CYBERPUNK EDITION</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-[#FF00FF]">Découvrez</span> les{" "}
            <span className="text-[#00FFFF]">meilleurs morceaux</span>
          </h1>
          <p className="text-[#FF00FF] text-xl">
            {tracks.length} morceau{tracks.length !== 1 ? "x" : ""} partagé{tracks.length !== 1 ? "s" : ""}
          </p>
        </section>

        {/* Search & Filters */}
        <SearchFilters
          search={search}
          author={author}
          sort={sort}
          onSearchChange={setSearch}
          onAuthorChange={setAuthor}
          onSortChange={setSort}
          onReset={handleReset}
        />

        {/* Tracks Grid */}
        <div className="mt-12">
          {loading && tracks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#00FFFF] text-lg">Chargement des morceaux...</p>
            </div>
          ) : tracks.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-16 h-16 mx-auto text-[#FF00FF] mb-4" />
              <p className="text-[#00FFFF] text-lg">
                Aucun morceau trouvé. Soyez le premier à en ajouter !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="p-6 border-2 border-[#00FFFF] bg-black/50 hover:shadow-[0_0_20px_#00FFFF] transition-all cursor-pointer group"
                  onClick={() => onSelectTrack(track)}
                >
                  {/* Track Info */}
                  <div className="mb-4">
                    <h3 className="text-[#FF00FF] font-bold text-lg mb-2 group-hover:text-[#00FFFF] transition-colors line-clamp-2">
                      {track.title}
                    </h3>
                    <p className="text-[#00FFFF] text-sm mb-2">
                      {track.author || "Artist"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(track.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  {/* Description */}
                  {track.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {track.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 pt-4 border-t border-[#FF00FF]/30">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#FF00FF]" />
                      <span className="text-[#FF00FF] font-bold">{track.likes}</span>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(track.id);
                      }}
                      className={`${
                        likedTracks.has(track.id)
                          ? "bg-[#FF00FF]/50 text-black"
                          : "bg-[#FF00FF] hover:bg-[#FF00FF]/80 text-black"
                      } font-bold py-1 px-3 text-sm`}
                    >
                      {likedTracks.has(track.id) ? "Aimé" : "Aimer"}
                    </Button>
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTrack(track);
                    }}
                    className="w-full bg-[#00FFFF] hover:bg-[#00FFFF]/80 text-black font-bold"
                  >
                    Voir les détails
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
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
