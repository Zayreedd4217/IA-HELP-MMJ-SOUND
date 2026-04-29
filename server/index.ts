import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory storage (will be replaced with database later)
interface Track {
  id: string;
  title: string;
  mmjUrl: string;
  author?: string;
  createdAt: number;
  likes: number;
}

const tracks: Map<string, Track> = new Map();

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // API Routes

  // Get all tracks
  app.get("/api/tracks", (_req, res) => {
    const trackList = Array.from(tracks.values()).sort(
      (a, b) => b.createdAt - a.createdAt
    );
    res.json(trackList);
  });

  // Get single track
  app.get("/api/tracks/:id", (req, res) => {
    const track = tracks.get(req.params.id);
    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }
    res.json(track);
  });

  // Create new track
  app.post("/api/tracks", (req, res) => {
    const { title, mmjUrl, author } = req.body;

    if (!title || !mmjUrl) {
      return res.status(400).json({ error: "Title and mmjUrl are required" });
    }

    const newTrack: Track = {
      id: uuidv4(),
      title,
      mmjUrl,
      author: author || "Artist",
      createdAt: Date.now(),
      likes: 0,
    };

    tracks.set(newTrack.id, newTrack);
    res.status(201).json(newTrack);
  });

  // Like a track
  app.post("/api/tracks/:id/like", (req, res) => {
    const track = tracks.get(req.params.id);
    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }

    track.likes += 1;
    res.json(track);
  });

  // Update track
  app.put("/api/tracks/:id", (req, res) => {
    const track = tracks.get(req.params.id);
    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }

    const { title, mmjUrl, author } = req.body;
    if (title) track.title = title;
    if (mmjUrl) track.mmjUrl = mmjUrl;
    if (author) track.author = author;

    res.json(track);
  });

  // Delete track
  app.delete("/api/tracks/:id", (req, res) => {
    if (!tracks.has(req.params.id)) {
      return res.status(404).json({ error: "Track not found" });
    }

    tracks.delete(req.params.id);
    res.json({ success: true });
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
