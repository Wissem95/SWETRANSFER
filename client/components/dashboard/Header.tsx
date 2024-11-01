// components/Header.tsx
'use client';

import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useStorageStore } from '@/store/storageStore';

export default function Header() {
  const { logout } = useAuth();
  const { storageUsed, storageLimit, isLoading, error, updateStorage } = useStorageStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      updateStorage();
    }
  }, [updateStorage]);

  // Convertir les bytes en GB
  const usedGB = (storageUsed / (1024 * 1024 * 1024)).toFixed(2);
  const limitGB = (storageLimit / (1024 * 1024 * 1024)).toFixed(2);

  return (
      <header className="bg-white shadow text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Logo />
            <div className="flex items-center gap-4">
              {isLoading ? (
                  <span className="text-gray-600">Loading...</span>
              ) : error ? (
                  <span className="text-red-600">{error}</span>
              ) : (
                  <span className="text-gray-600">
                Storage: {usedGB} GB / {limitGB} GB
              </span>
              )}
              <Button
                  variant="secondary"
                  onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
  );
}