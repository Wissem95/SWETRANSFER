"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { useStorageStore } from "@/store/storageStore";

export default function FileUpload({
  onUploadComplete,
}: {
  onUploadComplete: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateStorage = useStorageStore((state) => state.updateStorage);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
    if (file.size > MAX_FILE_SIZE) {
      alert(
        "Le fichier est trop volumineux. La taille maximale autorisée est de 2 Go."
      );
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 0,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!
          );
          setUploadProgress(percentCompleted);
        },
      });

      console.log("Upload successful:", response.data);
      await updateStorage();
      onUploadComplete();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      let errorMessage = "Échec du téléchargement du fichier";

      if (error.response) {
        console.error("Error response:", error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        console.error("Error request:", error.request);
        errorMessage = "Erreur de connexion au serveur";
      } else {
        console.error("Error:", error.message);
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Button onClick={handleClick} type="button" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload File"}
      </Button>

      {uploading && (
        <div className="w-full max-w-xs">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-center mt-1 text-gray-600">
            {uploadProgress}% Uploaded
          </p>
        </div>
      )}
    </div>
  );
}
