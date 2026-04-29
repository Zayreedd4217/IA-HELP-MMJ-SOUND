import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

interface Comment {
  id: string;
  trackId: string;
  userId: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  trackId: string;
}

export default function CommentSection({ trackId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingComments, setFetchingComments] = useState(true);
  const { user, getToken, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [trackId]);

  const fetchComments = async () => {
    try {
      setFetchingComments(true);
      const response = await axios.get<Comment[]>(
        `/api/tracks/${trackId}/comments`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setFetchingComments(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Vous devez être connecté pour commenter");
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.post<Comment>(
        `/api/tracks/${trackId}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) => [response.data, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Erreur lors de l'ajout du commentaire");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const token = getToken();
      await axios.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Erreur lors de la suppression du commentaire");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#FF00FF]">Commentaires</h2>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="bg-black border-2 border-[#00FFFF] text-white placeholder-gray-500 focus:border-[#FF00FF] focus:shadow-[0_0_10px_#FF00FF]"
            />
            <Button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="bg-[#FF00FF] hover:bg-[#FF00FF]/80 text-black font-bold"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Envoyer"
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-4 border-2 border-[#00FFFF] bg-black/50 text-center">
          <p className="text-[#00FFFF]">
            Connectez-vous pour ajouter un commentaire
          </p>
        </div>
      )}

      {/* Comments List */}
      {fetchingComments ? (
        <div className="text-center py-8">
          <p className="text-[#00FFFF]">Chargement des commentaires...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#00FFFF]">Aucun commentaire pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 border-2 border-[#00FFFF] bg-black/50"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-[#FF00FF] font-bold">Utilisateur</p>
                {user?.id === comment.userId && (
                  <Button
                    onClick={() => handleDeleteComment(comment.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-[#00FFFF] mb-2">{comment.content}</p>
              <p className="text-gray-500 text-xs">
                {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
