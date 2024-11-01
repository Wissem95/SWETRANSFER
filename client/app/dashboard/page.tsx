'use client';

import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/dashboard/Header';
import FileUpload from '@/components/dashboard/FileUpload';
import FileList from '@/components/dashboard/FileList';

export default function DashboardPage() {
  useAuth(); // Protection de la route

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              My Files
            </h2>
          </div>
          <FileUpload onUploadComplete={() => {
            // Rafraîchir la liste des fichiers
            window.location.reload();
          }} />
        </div>

        <FileList onDeleteComplete={() => {
          // Rafraîchir la liste des fichiers
          window.location.reload();
        }} />
      </main>
    </div>
  );
}
