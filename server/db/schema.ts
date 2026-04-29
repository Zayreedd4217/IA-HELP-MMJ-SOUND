import { mysqlTable, varchar, text, int, timestamp, boolean, mysqlEnum } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// Users table
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tracks table
export const tracks = mysqlTable("tracks", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  mmjUrl: text("mmj_url").notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  description: text("description"),
  likes: int("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comments table
export const comments = mysqlTable("comments", {
  id: varchar("id", { length: 36 }).primaryKey(),
  trackId: varchar("track_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Likes table (for tracking who liked what)
export const trackLikes = mysqlTable("track_likes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  trackId: varchar("track_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tracks: many(tracks),
  comments: many(comments),
  likes: many(trackLikes),
}));

export const tracksRelations = relations(tracks, ({ one, many }) => ({
  user: one(users, {
    fields: [tracks.userId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(trackLikes),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  track: one(tracks, {
    fields: [comments.trackId],
    references: [tracks.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const trackLikesRelations = relations(trackLikes, ({ one }) => ({
  track: one(tracks, {
    fields: [trackLikes.trackId],
    references: [tracks.id],
  }),
  user: one(users, {
    fields: [trackLikes.userId],
    references: [users.id],
  }),
}));
