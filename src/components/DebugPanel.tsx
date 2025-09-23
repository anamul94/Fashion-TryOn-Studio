import React from 'react';
import type { ImageData, GeneratedImage } from '../types';

interface DebugPanelProps {
  userImage: ImageData | null;
  garmentImage: ImageData | null;
  generatedImage: GeneratedImage | null;
  isLoading: boolean;
  error: string | null;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  userImage,
  garmentImage,
  generatedImage,
  isLoading,
  error
}) => {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    userImage: userImage ? {
      name: userImage.name,
      mimeType: userImage.mimeType,
      base64Length: userImage.base64.length,
      base64Preview: userImage.base64.substring(0, 50) + '...'
    } : null,
    garmentImage: garmentImage ? {
      name: garmentImage.name,
      mimeType: garmentImage.mimeType,
      base64Length: garmentImage.base64.length,
      base64Preview: garmentImage.base64.substring(0, 50) + '...'
    } : null,
    generatedImage: generatedImage ? {
      altText: generatedImage.altText,
      imageUrlLength: generatedImage.imageUrl.length,
      imageUrlPreview: generatedImage.imageUrl.substring(0, 50) + '...',
      isDataUrl: generatedImage.imageUrl.startsWith('data:')
    } : null,
    isLoading,
    error
  };

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-90 text-white p-2 rounded-lg max-w-xs max-h-64 overflow-auto text-xs font-mono z-50">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-bold text-green-400 text-xs">🐛 Debug</h3>
        <button 
          onClick={() => console.log('🐛 Full debug info:', debugInfo)}
          className="text-blue-400 hover:text-blue-300 text-xs"
        >
          Log
        </button>
      </div>
      
      <div className="space-y-1">
        <div>
          <span className="text-yellow-400">Timestamp:</span> {debugInfo.timestamp}
        </div>
        
        <div>
          <span className="text-yellow-400">User Image:</span> {
            debugInfo.userImage ? (
              <span className="text-green-300">✅ {debugInfo.userImage.name}</span>
            ) : (
              <span className="text-red-300">❌ None</span>
            )
          }
        </div>
        
        <div>
          <span className="text-yellow-400">Garment Image:</span> {
            debugInfo.garmentImage ? (
              <span className="text-green-300">✅ {debugInfo.garmentImage.name}</span>
            ) : (
              <span className="text-red-300">❌ None</span>
            )
          }
        </div>
        
        <div>
          <span className="text-yellow-400">Generated Image:</span> {
            debugInfo.generatedImage ? (
              <span className="text-green-300">✅ Generated</span>
            ) : (
              <span className="text-red-300">❌ None</span>
            )
          }
        </div>
        
        <div>
          <span className="text-yellow-400">Loading:</span> {
            isLoading ? <span className="text-blue-300">✅ True</span> : <span className="text-gray-300">❌ False</span>
          }
        </div>
        
        <div>
          <span className="text-yellow-400">Error:</span> {
            error ? <span className="text-red-300">{error}</span> : <span className="text-green-300">None</span>
          }
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-600">
        <button 
          onClick={() => {
            console.log('🧪 Testing canvas generation...');
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#ff0000';
              ctx.fillRect(0, 0, 200, 200);
              ctx.fillStyle = '#ffffff';
              ctx.font = '16px Arial';
              ctx.textAlign = 'center';
              ctx.fillText('Test', 100, 100);
              const testUrl = canvas.toDataURL();
              console.log('✅ Canvas test successful:', testUrl.substring(0, 50) + '...');
            } else {
              console.error('❌ Canvas test failed');
            }
          }}
          className="text-blue-400 hover:text-blue-300 text-xs"
        >
          Test Canvas
        </button>
      </div>
    </div>
  );
};