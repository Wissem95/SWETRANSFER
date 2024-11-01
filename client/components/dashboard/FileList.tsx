"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Button from "@/components/ui/Button";

interface File {
  id: number;
  original_name: string;
  size: number;
  mime_type: string;
  createdAt: string;
  share_link?: string;
}

export default function FileList({
  onDeleteComplete,
}: {
  onDeleteComplete: () => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [currentShareLink, setCurrentShareLink] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await api.get("/files/list");
      setFiles(response.data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleShare = async (fileId: number) => {
    try {
      const response = await api.post(`/files/${fileId}/share`);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const shareUrl = `${apiUrl}/api/files/shared/${response.data.share_link}`;
      setCurrentShareLink(shareUrl);
      setShareModalOpen(true);
    } catch (error) {
      console.error("Error sharing file:", error);
      alert("Erreur lors de la génération du lien de partage");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentShareLink);
      alert("Lien copié dans le presse-papiers !");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Erreur lors de la copie du lien");
    }
  };

  const handleDelete = async (fileId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) return;

    try {
      await api.delete(`/files/${fileId}`);
      await fetchFiles();
      onDeleteComplete();
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Erreur lors de la suppression du fichier");
    }
  };

  return (
    <div className="relative">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {files.map((file) => (
            <li key={file.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.original_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleShare(file.id)}
                    variant="secondary"
                    className="text-sm"
                  >
                    Partager
                  </Button>
                  <Button
                    onClick={() => handleDelete(file.id)}
                    className="text-sm bg-red-600 hover:bg-red-700 text-white"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal de partage */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Lien de partage
            </h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentShareLink}
                readOnly
                className="flex-1 p-2 border rounded text-gray-900"
              />
              <Button onClick={copyToClipboard} variant="secondary">
                Copier
              </Button>
            </div>
            <Button onClick={() => setShareModalOpen(false)} variant="primary">
              Fermer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
