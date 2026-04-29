import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import TrackPage from "./TrackPage";

/**
 * Design: Cyberpunk Edition
 * - Color Palette: #FF00FF (Magenta) + #00FFFF (Cyan) on black background
 * - Style: Neon borders, glowing effects, retro-futuristic aesthetic
 * - Typography: Bold, high contrast
 */

interface Track {
  id: string;
  title: string;
  mmjUrl: string;
  author?: string;
}

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [formData, setFormData] = useState({
    id: "caa7bbb1-42b1-11f1-a2dd-06b28167ed5",
    title: "",
    mmjUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call to fetch track details
      const newTrack: Track = {
        id: formData.id,
        title: formData.title || "Untitled Track",
        mmjUrl: formData.mmjUrl,
        author: "CyberDJ", // Default author
      };

      setTracks((prev) => [newTrack, ...prev]);
      setSelectedTrack(newTrack);
      setFormData({ id: "", title: "", mmjUrl: "" });
    } catch (error) {
      console.error("Error loading track:", error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedTrack) {
    return (
      <TrackPage
        track={selectedTrack}
        onBack={() => setSelectedTrack(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b-2 border-[#FF00FF] bg-black/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">
              <span className="text-[#FF00FF]">♫</span>
              <span className="text-[#00FFFF] ml-2">MMJ Helper</span>
            </div>
            <div className="text-xs text-[#FF00FF]">CYBERPUNK EDITION</div>
          </div>
          <Button className="bg-[#00FFFF] hover:bg-[#00FFFF]/80 text-black font-bold">
            Connexion
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-[#FF00FF]">Découvrez</span> et{" "}
            <span className="text-[#00FFFF]">partagez</span>
          </h1>
          <p className="text-[#FF00FF] text-xl">Des morceaux Music Maker Jam</p>
        </section>

        {/* Form Section */}
        <section className="mb-12 p-6 border-2 border-[#FF00FF] shadow-[0_0_20px_#FF00FF] bg-black/50">
          <h2 className="text-2xl font-bold text-[#00FFFF] mb-6">
            Ajouter un morceau
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#FF00FF] font-bold mb-2">
                ID du morceau MMJ *
              </label>
              <Input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                placeholder="Ex: caa7bbb1-42b1-11f1-a2dd-06b28167ed5"
                className="bg-black border-2 border-[#00FFFF] text-white placeholder-gray-500 focus:border-[#FF00FF] focus:shadow-[0_0_10px_#FF00FF]"
                required
              />
            </div>

            <div>
              <label className="block text-[#FF00FF] font-bold mb-2">
                Titre du morceau *
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Ma création musicale"
                className="bg-black border-2 border-[#00FFFF] text-white placeholder-gray-500 focus:border-[#FF00FF] focus:shadow-[0_0_10px_#FF00FF]"
                required
              />
            </div>

            <div>
              <label className="block text-[#FF00FF] font-bold mb-2">
                Lien Music Maker Jam *
              </label>
              <Input
                type="url"
                name="mmjUrl"
                value={formData.mmjUrl}
                onChange={handleInputChange}
                placeholder="https://musicmakerja.com/..."
                className="bg-black border-2 border-[#00FFFF] text-white placeholder-gray-500 focus:border-[#FF00FF] focus:shadow-[0_0_10px_#FF00FF]"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF00FF] hover:bg-[#FF00FF]/80 text-black font-bold py-3 shadow-[0_0_15px_#FF00FF]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                "Charger le morceau"
              )}
            </Button>
          </form>
        </section>

        {/* Tracks List */}
        {tracks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#00FFFF] text-lg">
              Entrez un ID de morceau pour commencer
            </p>
          </div>
        ) : (
          <section className="grid gap-4">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="p-4 border-2 border-[#00FFFF] bg-black/50 cursor-pointer hover:shadow-[0_0_20px_#00FFFF] transition-all"
                onClick={() => setSelectedTrack(track)}
              >
                <h3 className="text-[#FF00FF] font-bold">{track.title}</h3>
                <p className="text-[#00FFFF] text-sm">{track.id}</p>
              </div>
            ))}
          </section>
        )}
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
