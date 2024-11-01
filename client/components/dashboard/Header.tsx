'use client';

import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

export default function Header() {
  const { logout } = useAuth();
  const [storageUsed, setStorageUsed] = useState(0);

  useEffect(() => {
    const fetchStorageUsage = async () => {
      try {
        const response = await fetch('/api/storage/usage');
        const data = await response.json();
        setStorageUsed(data.usedStorage); // Supposons que l'API renvoie la taille en MB
      } catch (error) {
        console.error('Failed to fetch storage usage:', error);
      }
    };

    fetchStorageUsage();
  }, []);

  // Convertir en GB si nécessaire
  const usedGB = (storageUsed / 1024).toFixed(2);

  return (
    <header className="bg-white shadow text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Storage: {usedGB} GB / 2 GB</span>
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
