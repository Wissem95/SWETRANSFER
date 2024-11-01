// store/storageStore.ts
import { create } from 'zustand';

interface StorageState {
    storageUsed: number;
    storageLimit: number;
    isLoading: boolean;
    error: string | null;
    updateStorage: () => Promise<void>;
}

const fetchStorageUsage = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/storage/usage', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export const useStorageStore = create<StorageState>((set) => ({
    storageUsed: 0,
    storageLimit: 2147483648, // 2GB en bytes
    isLoading: false,
    error: null,
    updateStorage: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await fetchStorageUsage();
            if (data.success) {
                set({
                    storageUsed: data.storage_used,
                    storageLimit: data.storage_limit,
                    isLoading: false
                });
            }
        } catch (error) {
            console.error('Failed to update storage:', error);
            set({ error: 'Failed to update storage', isLoading: false });
        }
    }
}));