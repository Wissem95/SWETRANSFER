import { create } from "zustand";
import api from "@/lib/api";

interface StorageState {
  storageUsed: number;
  storageLimit: number;
  isLoading: boolean;
  error: string | null;
  updateStorage: () => Promise<void>;
}

export const useStorageStore = create<StorageState>((set) => ({
  storageUsed: 0,
  storageLimit: 0,
  isLoading: false,
  error: null,
  updateStorage: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get("/storage/usage");
      set({
        storageUsed: response.data.storage_used,
        storageLimit: response.data.storage_limit,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to update storage:", error);
      set({ error: "Failed to update storage", isLoading: false });
    }
  },
}));
