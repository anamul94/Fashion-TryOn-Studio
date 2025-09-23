import React, { useRef, useState } from 'react';
import type { ImageData } from '../types';

interface ImageUploaderProps {
  id: string;
  title: string;
  onImageUpload: (image: ImageData | null) => void;
  imageData: ImageData | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  id,
  title,
  onImageUpload,
  imageData,
}) => {
  console.log('🖼️ ImageUploader rendered:', {
    id,
    title,
    hasImageData: !!imageData,
    imageName: imageData?.name
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    console.log('📎 ImageUploader: File selected:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });
    
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Please select an image file.';
      console.warn('⚠️ ImageUploader: Invalid file type:', file.type);
      alert(errorMsg);
      return;
    }

    console.log('📚 ImageUploader: Starting file read...');
    const reader = new FileReader();
    
    reader.onload = (e) => {
      console.log('📚 ImageUploader: File read completed');
      const result = e.target?.result as string;
      if (result) {
        const [header, base64] = result.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] ?? 'image/png';
        
        const imageData = {
          base64,
          mimeType,
          name: file.name,
        };
        
        console.log('✅ ImageUploader: Image data created:', {
          name: imageData.name,
          mimeType: imageData.mimeType,
          base64Length: imageData.base64.length,
          base64Preview: imageData.base64.substring(0, 50) + '...'
        });
        
        onImageUpload(imageData);
        console.log('✅ ImageUploader: onImageUpload called');
      } else {
        console.error('❌ ImageUploader: No result from FileReader');
      }
    };
    
    reader.onerror = (error) => {
      console.error('❌ ImageUploader: FileReader error:', error);
    };
    
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearImage = () => {
    console.log('🗑️ ImageUploader: Clearing image for:', title);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    console.log('✅ ImageUploader: Image cleared');
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragOver
            ? 'border-indigo-400 bg-indigo-50'
            : imageData
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        {imageData ? (
          <div className="space-y-3">
            <img
              src={`data:${imageData.mimeType};base64,${imageData.base64}`}
              alt={imageData.name}
              className="w-full h-32 object-cover rounded-md"
            />
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Replace
              </button>
              <button
                onClick={clearImage}
                className="flex-1 px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-gray-400">
              <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="text-sm text-gray-600">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Click to upload
              </button>
              <span> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
};