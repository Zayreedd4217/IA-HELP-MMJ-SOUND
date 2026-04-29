import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const { login, register, loading, error } = useAuth();
  const [, navigate] = useLocation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate("/");
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Les mots de passe ne correspondent pas");
        return;
      }
      const success = await register(
        formData.email,
        formData.username,
        formData.password
      );
      if (success) {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      {/* Header */}
      <header className="border-b-2 border-[#FF00FF] bg-black/80 backdrop-blur sticky top-0 z-50 w-full">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">
              <span className="text-[#FF00FF]">♫</span>
              <span className="text-[#00FFFF] ml-2">MMJ Helper</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md px-4">
        <div className="p-8 border-2 border-[#FF00FF] shadow-[0_0_20px_#FF00FF] bg-black/50">
          <h1 className="text-3xl font-bold text-[#FF00FF] mb-2 text-center">
            {isLogin ? "Connexion" : "Inscription"}
          </h1>
          <p className="text-[#00FFFF] text-center mb-6">
            {isLogin
              ? "Connectez-vous à votre compte"
              : "Créez un nouveau compte"}
          </p>

          {error && (
            <div className="mb-4 p-4 border-2 border-red-500 bg-red-500/10 text-red-400 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#FF00FF] font-bold mb-2">
                Email *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="bg-black border-2 border-[#00FFFF] text-white placeholder-gray-500 focus:border-[#FF00FF] focus:shadow-[0_0_10px_#FF00FF]"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-[#FF00FF] font-bold mb-2">
                  Nom d'utilisateur *
                </label>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="CyberDJ"
                  className="bg-black border-2 border-[#00FFFF] text-white placeholder-gray-500 focus:border-[#FF00FF] focus:shadow-[0_0_10px_#FF00FF]"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[#FF00FF] font-bold mb-2">
                Mot de passe *
              </label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="bg-black border-2 border-[#00FFFF] text-white placeholder-gray-500 focus:border-[#FF00FF] focus:shadow-[0_0_10px_#FF00FF]"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-[#FF00FF] font-bold mb-2">
                  Confirmer le mot de passe *
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="bg-black border-2 border-[#00FFFF] text-white placeholder-gray-500 focus:border-[#FF00FF] focus:shadow-[0_0_10px_#FF00FF]"
                  required
                />
              </div>
            )}

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
              ) : isLogin ? (
                "Se connecter"
              ) : (
                "S'inscrire"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#00FFFF] mb-3">
              {isLogin
                ? "Pas encore de compte ?"
                : "Vous avez déjà un compte ?"}
            </p>
            <Button
              onClick={() => setIsLogin(!isLogin)}
              variant="ghost"
              className="text-[#FF00FF] hover:text-[#00FFFF]"
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
