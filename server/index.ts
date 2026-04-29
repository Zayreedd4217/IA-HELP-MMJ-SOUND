import express, { Request, Response } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import { authMiddleware, generateToken, hashPassword, comparePasswords, verifyToken } from "./auth";
import { initializeDatabase, getDatabase } from "./db";
import { users, tracks, comments, trackLikes } from "./db/schema";
import { eq, like, desc, and } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AuthRequest extends Request {
  user?: { userId: string; email: string; username: string };
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Initialize database
  try {
    await initializeDatabase();
  } catch (error) {
    console.error("Failed to initialize database:", error);
    console.log("Running in memory mode (database not available)");
  }

  // Middleware
  app.use(express.json());

  // Serve static files
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // ============ AUTH ROUTES ============

  // Register
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const db = getDatabase();
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const userId = uuidv4();
      const passwordHash = await hashPassword(password);

      await db.insert(users).values({
        id: userId,
        email,
        username,
        passwordHash,
      });

      const token = generateToken({ userId, email, username });
      res.status(201).json({ token, user: { id: userId, email, username } });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
      }

      const db = getDatabase();
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (user.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isPasswordValid = await comparePasswords(password, user[0].passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken({
        userId: user[0].id,
        email: user[0].email,
        username: user[0].username,
      });

      res.json({
        token,
        user: {
          id: user[0].id,
          email: user[0].email,
          username: user[0].username,
          avatar: user[0].avatar,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Get current user
  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const db = getDatabase();
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, req.user!.userId))
        .limit(1);

      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user[0].id,
        email: user[0].email,
        username: user[0].username,
        avatar: user[0].avatar,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // ============ TRACK ROUTES ============

  // Get all tracks with search and filters
  app.get("/api/tracks", async (req: Request, res: Response) => {
    try {
      const db = getDatabase();
      const { search, author, sort = "recent" } = req.query;

      let whereConditions: any[] = [];

      if (search) {
        whereConditions.push(like(tracks.title, `%${search}%`));
      }

      if (author) {
        whereConditions.push(eq(tracks.author, author as string));
      }

      let orderBy;
      switch (sort) {
        case "popular":
          orderBy = desc(tracks.likes);
          break;
        case "oldest":
          orderBy = tracks.createdAt;
          break;
        default:
          orderBy = desc(tracks.createdAt);
      }

      let query: any = db.select().from(tracks);
      if (whereConditions.length > 0) {
        query = query.where(and(...whereConditions));
      }
      const result = await query.orderBy(orderBy);
      res.json(result);
    } catch (error) {
      console.error("Get tracks error:", error);
      res.status(500).json({ error: "Failed to fetch tracks" });
    }
  });

  // Get single track
  app.get("/api/tracks/:id", async (req: Request, res: Response) => {
    try {
      const db = getDatabase();
      const track = await db
        .select()
        .from(tracks)
        .where(eq(tracks.id, req.params.id))
        .limit(1);

      if (track.length === 0) {
        return res.status(404).json({ error: "Track not found" });
      }

      res.json(track[0]);
    } catch (error) {
      console.error("Get track error:", error);
      res.status(500).json({ error: "Failed to fetch track" });
    }
  });

  // Create track
  app.post("/api/tracks", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { title, mmjUrl, author, description } = req.body;

      if (!title || !mmjUrl) {
        return res.status(400).json({ error: "Title and mmjUrl are required" });
      }

      const db = getDatabase();
      const trackId = uuidv4();

      await db.insert(tracks).values({
        id: trackId,
        title,
        mmjUrl,
        author: author || req.user!.username,
        userId: req.user!.userId,
        description,
        likes: 0,
      });

      const newTrack = await db
        .select()
        .from(tracks)
        .where(eq(tracks.id, trackId))
        .limit(1);

      res.status(201).json(newTrack[0]);
    } catch (error) {
      console.error("Create track error:", error);
      res.status(500).json({ error: "Failed to create track" });
    }
  });

  // Update track
  app.put("/api/tracks/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const db = getDatabase();
      const track = await db
        .select()
        .from(tracks)
        .where(eq(tracks.id, req.params.id))
        .limit(1);

      if (track.length === 0) {
        return res.status(404).json({ error: "Track not found" });
      }

      if (track[0].userId !== req.user!.userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const { title, description, author } = req.body;

      await db
        .update(tracks)
        .set({
          ...(title && { title }),
          ...(description && { description }),
          ...(author && { author }),
        })
        .where(eq(tracks.id, req.params.id));

      const updated = await db
        .select()
        .from(tracks)
        .where(eq(tracks.id, req.params.id))
        .limit(1);

      res.json(updated[0]);
    } catch (error) {
      console.error("Update track error:", error);
      res.status(500).json({ error: "Failed to update track" });
    }
  });

  // Delete track
  app.delete("/api/tracks/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const db = getDatabase();
      const track = await db
        .select()
        .from(tracks)
        .where(eq(tracks.id, req.params.id))
        .limit(1);

      if (track.length === 0) {
        return res.status(404).json({ error: "Track not found" });
      }

      if (track[0].userId !== req.user!.userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      await db.delete(tracks).where(eq(tracks.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Delete track error:", error);
      res.status(500).json({ error: "Failed to delete track" });
    }
  });

  // ============ LIKE ROUTES ============

  // Like a track
  app.post("/api/tracks/:id/like", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const db = getDatabase();

      const existingLike = await db
        .select()
        .from(trackLikes)
        .where(
          and(
            eq(trackLikes.trackId, req.params.id),
            eq(trackLikes.userId, req.user!.userId)
          )
        )
        .limit(1);

      if (existingLike.length > 0) {
        return res.status(400).json({ error: "Already liked" });
      }

      const likeId = uuidv4();
      await db.insert(trackLikes).values({
        id: likeId,
        trackId: req.params.id,
        userId: req.user!.userId,
      });

      // Update likes count
      const track = await db
        .select()
        .from(tracks)
        .where(eq(tracks.id, req.params.id))
        .limit(1);

      if (track.length > 0) {
        await db
          .update(tracks)
          .set({ likes: (track[0].likes || 0) + 1 })
          .where(eq(tracks.id, req.params.id));
      }

      const updated = await db
        .select()
        .from(tracks)
        .where(eq(tracks.id, req.params.id))
        .limit(1);

      res.json(updated[0]);
    } catch (error) {
      console.error("Like track error:", error);
      res.status(500).json({ error: "Failed to like track" });
    }
  });

  // Unlike a track
  app.delete("/api/tracks/:id/like", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const db = getDatabase();

      await db
        .delete(trackLikes)
        .where(
          and(
            eq(trackLikes.trackId, req.params.id),
            eq(trackLikes.userId, req.user!.userId)
          )
        );

      // Update likes count
      const track = await db
        .select()
        .from(tracks)
        .where(eq(tracks.id, req.params.id))
        .limit(1);

      if (track.length > 0) {
        await db
          .update(tracks)
          .set({ likes: Math.max(0, (track[0].likes || 0) - 1) })
          .where(eq(tracks.id, req.params.id));
      }

      const updated = await db
        .select()
        .from(tracks)
        .where(eq(tracks.id, req.params.id))
        .limit(1);

      res.json(updated[0]);
    } catch (error) {
      console.error("Unlike track error:", error);
      res.status(500).json({ error: "Failed to unlike track" });
    }
  });

  // ============ COMMENT ROUTES ============

  // Get comments for a track
  app.get("/api/tracks/:id/comments", async (req: Request, res: Response) => {
    try {
      const db = getDatabase();
      const trackComments = await db
        .select()
        .from(comments)
        .where(eq(comments.trackId, req.params.id))
        .orderBy(desc(comments.createdAt));

      res.json(trackComments);
    } catch (error) {
      console.error("Get comments error:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  // Add comment
  app.post("/api/tracks/:id/comments", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Comment content is required" });
      }

      const db = getDatabase();
      const commentId = uuidv4();

      await db.insert(comments).values({
        id: commentId,
        trackId: req.params.id,
        userId: req.user!.userId,
        content,
      });

      const newComment = await db
        .select()
        .from(comments)
        .where(eq(comments.id, commentId))
        .limit(1);

      res.status(201).json(newComment[0]);
    } catch (error) {
      console.error("Add comment error:", error);
      res.status(500).json({ error: "Failed to add comment" });
    }
  });

  // Delete comment
  app.delete("/api/comments/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const db = getDatabase();
      const comment = await db
        .select()
        .from(comments)
        .where(eq(comments.id, req.params.id))
        .limit(1);

      if (comment.length === 0) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (comment[0].userId !== req.user!.userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      await db.delete(comments).where(eq(comments.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Delete comment error:", error);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });

  // Handle client-side routing
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
