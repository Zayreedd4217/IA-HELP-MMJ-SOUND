import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import TrackPage from "./TrackPage";
import { useTrackAPI, Track } from "@/hooks/useTrackAPI";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

/**
 * Design: Cyberpunk Edition
 * - Color Palette: #FF00FF (Magenta) + #00FFFF (Cyan) on black background
 * - Style: Neon borders, glowing effects, retro-futuristic aesthetic
 * - Typography: Bold, high contrast
 */

export default function Home() {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    mmjUrl: "",
    author: "",
    description: "",
  });
  const { createTrack, loading, error } = useTrackAPI();
  const { isAuthenticated, getToken } = useAuth();
  const [, navigate] = useLocation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Vous devez être connecté pour ajouter un morceau");
      navigate("/login");
      return;
    }

    if (!formData.title || !formData.mmjUrl) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const token = getToken();
    const newTrack = await createTrack(
      formData.title,
      formData.mmjUrl,
      formData.author || "Artist",
      formData.description,
      token || undefined
    );

    if (newTrack) {
      setSelectedTrack(newTrack);
      setFormData({ title: "", mmjUrl: "", author: "", description: "" });
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
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/gallery")}
              className="bg-[#00FFFF] hover:bg-[#00FFFF]/80 text-black font-bold"
            >
              Galerie
            </Button>
            <Button
              onClick={() => navigate("/login")}
              className="bg-[#FF00FF] hover:bg-[#FF00FF]/80 text-black font-bold"
            >
              {isAuthenticated ? "Profil" : "Connexion"}
            </Button>
          </div>
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
          <p className="text-[#FF00FF] text-xl">
            Des morceaux Music Maker Jam avec style
          </p>
        </section>

        {/* Form Section */}
        {isAuthenticated ? (
          <section className="mb-12 p-6 border-2 border-[#FF00FF] shadow-[0_0_20px_#FF00FF] bg-black/50">
            <h2 className="text-2xl font-bold text-[#00FFFF] mb-6">
              Ajouter un morceau
            </h2>

            {error && (
              <div className="mb-4 p-4 border-2 border-red-500 bg-red-500/10 text-red-400 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  Auteur
                </label>
                <Input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Ex: CyberDJ"
                  className="bg-black border-2 border-[#00FFFF] text-white placeholder-gray-500 focus:border-[#FF00FF] focus:shadow-[0_0_10px_#FF00FF]"
                />
              </div>

              <div>
                <label className="block text-[#FF00FF] font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez votre morceau..."
                  className="w-full bg-black border-2 border-[#00FFFF] text-white placeholder-gray-500 focus:border-[#FF00FF] focus:shadow-[0_0_10px_#FF00FF] px-3 py-2 rounded"
                  rows={3}
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
        ) : (
          <section className="mb-12 p-6 border-2 border-[#FF00FF] shadow-[0_0_20px_#FF00FF] bg-black/50 text-center">
            <h2 className="text-2xl font-bold text-[#FF00FF] mb-4">
              Connectez-vous pour partager
            </h2>
            <p className="text-[#00FFFF] mb-6">
              Créez un compte pour ajouter vos morceaux et interagir avec la communauté
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="bg-[#FF00FF] hover:bg-[#FF00FF]/80 text-black font-bold py-3 px-8"
            >
              Se connecter / S'inscrire
            </Button>
          </section>
        )}

        {/* Info Section */}
        <section className="text-center py-12">
          <p className="text-[#00FFFF] text-lg mb-4">
            Découvrez les meilleurs morceaux dans notre galerie
          </p>
          <Button
            onClick={() => navigate("/gallery")}
            className="bg-[#00FFFF] hover:bg-[#00FFFF]/80 text-black font-bold py-3 px-8"
          >
            Accéder à la Galerie
          </Button>
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
