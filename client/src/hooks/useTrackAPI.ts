import { useState, useCallback } from "react";
import axios from "axios";

export interface Track {
  id: string;
  title: string;
  mmjUrl: string;
  author?: string;
  userId: string;
  description?: string;
  createdAt: number;
  likes: number;
}

const API_BASE = "/api";

export function useTrackAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllTracks = useCallback(
    async (
      search?: string,
      author?: string,
      sort?: string
    ): Promise<Track[]> => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (author) params.append("author", author);
        if (sort) params.append("sort", sort);

        const response = await axios.get<Track[]>(
          `${API_BASE}/tracks?${params.toString()}`
        );
        return response.data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch tracks";
        setError(message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getTrack = useCallback(async (id: string): Promise<Track | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Track>(`${API_BASE}/tracks/${id}`);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch track";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTrack = useCallback(
    async (
      title: string,
      mmjUrl: string,
      author?: string,
      description?: string,
      token?: string
    ): Promise<Track | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post<Track>(
          `${API_BASE}/tracks`,
          {
            title,
            mmjUrl,
            author,
            description,
          },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        return response.data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create track";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const likeTrack = useCallback(
    async (id: string, token?: string): Promise<Track | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post<Track>(
          `${API_BASE}/tracks/${id}/like`,
          {},
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        return response.data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to like track";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const unlikeTrack = useCallback(
    async (id: string, token?: string): Promise<Track | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.delete<Track>(
          `${API_BASE}/tracks/${id}/like`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        return response.data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to unlike track";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateTrack = useCallback(
    async (
      id: string,
      updates: Partial<Track>,
      token?: string
    ): Promise<Track | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.put<Track>(
          `${API_BASE}/tracks/${id}`,
          updates,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        return response.data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update track";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteTrack = useCallback(
    async (id: string, token?: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await axios.delete(`${API_BASE}/tracks/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete track";
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    getAllTracks,
    getTrack,
    createTrack,
    likeTrack,
    unlikeTrack,
    updateTrack,
    deleteTrack,
  };
}
