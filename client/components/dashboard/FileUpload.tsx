'use client';

import { useRef } from 'react';
import Button from '@/components/ui/Button';
import api from '@/lib/api';

export default function FileUpload({ onUploadComplete }: { onUploadComplete: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    // Déclenche le clic sur l'input file caché
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Upload successful:', response.data);
      onUploadComplete();
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file');
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button 
        onClick={handleClick}
        type="button"
      >
        Upload File
      </Button>
    </>
  );
}
