import React, { useState, useCallback } from 'react';
import type { ImageData, GeneratedImage } from '../types';
import { ImageUploader } from './ImageUploader';
import { DebugPanel } from './DebugPanel';
import { generateTryOnImage } from '../services/openRouterService';

interface TryOnProps {
  onImageGenerated: (image: GeneratedImage) => void;
  userImage: ImageData | null;
  onUserImageUpload: (image: ImageData | null) => void;
  garmentImage: ImageData | null;
  onGarmentImageUpload: (image: ImageData | null) => void;
  generatedImage: GeneratedImage | null;
  onClearGeneratedImage: () => void;
}

export const TryOn: React.FC<TryOnProps> = ({
  onImageGenerated,
  userImage,
  onUserImageUpload,
  garmentImage,
  onGarmentImageUpload,
  generatedImage,
  onClearGeneratedImage
}) => {
  console.log('🔄 TryOn: Component rendered with props:', {
    hasOnImageGenerated: !!onImageGenerated,
    hasUserImage: !!userImage,
    hasGarmentImage: !!garmentImage,
    hasGeneratedImage: !!generatedImage,
    userImageName: userImage?.name,
    garmentImageName: garmentImage?.name
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    console.log('🎬 TryOn: handleGenerate called');
    console.log('📋 TryOn: Current state:', {
      hasUserImage: !!userImage,
      hasGarmentImage: !!garmentImage,
      isLoading,
      error
    });
    
    if (!userImage || !garmentImage) {
      const errorMsg = 'Please upload both a user photo and a garment image.';
      console.warn('⚠️ TryOn: Missing images:', errorMsg);
      setError(errorMsg);
      return;
    }
    
    console.log('🚀 TryOn: Starting generation process...');
    setIsLoading(true);
    setError(null);
    onClearGeneratedImage();

    try {
      console.log('📞 TryOn: Calling generateTryOnImage...');
      const result = await generateTryOnImage(userImage, garmentImage);
      
      console.log('📥 TryOn: Generation result received:', {
        hasResult: !!result,
        imageUrlExists: !!result?.imageUrl,
        imageUrlLength: result?.imageUrl?.length,
        altText: result?.altText
      });
      
      if (result) {
        console.log('✅ TryOn: Calling onImageGenerated with result');
        onImageGenerated(result);
        console.log('✅ TryOn: onImageGenerated completed');
      } else {
        const errorMsg = 'Failed to generate try-on image. Please try different images.';
        console.error('❌ TryOn: No result returned:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('❌ TryOn: Exception caught:', err);
      console.error('❌ TryOn: Error message:', errorMsg);
      setError(errorMsg);
    } finally {
      console.log('🏁 TryOn: Generation process completed, setting loading to false');
      setIsLoading(false);
    }
  }, [userImage, garmentImage, onImageGenerated, onClearGeneratedImage, isLoading, error]);

  const handleReset = () => {
    console.log('🔄 TryOn: Reset button clicked');
    onUserImageUpload(null);
    onGarmentImageUpload(null);
    onClearGeneratedImage();
    setError(null);
    setIsLoading(false);
    console.log('✅ TryOn: Reset completed');
  };

  const canGenerate = userImage && garmentImage && !isLoading;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Input Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ImageUploader 
            id="user-upload" 
            title="1. Your Photo" 
            onImageUpload={onUserImageUpload} 
            imageData={userImage} 
          />
          <ImageUploader 
            id="garment-upload" 
            title="2. Garment/Outfit" 
            onImageUpload={onGarmentImageUpload} 
            imageData={garmentImage} 
          />
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full sm:w-auto flex-grow flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            {isLoading ? 'Generating...' : 'Try On Outfit'}
          </button>
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-full aspect-square flex items-center justify-center">
          {isLoading && (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-700 font-medium">Creating your try-on image...</p>
              <p className="text-sm text-gray-500">This may take a moment for the best results.</p>
            </div>
          )}
          
          {error && (
            <div className="text-center text-red-700 bg-red-50 p-6 rounded-lg border border-red-200 w-full">
              <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="font-bold text-lg mb-2">Generation Failed</h4>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {!isLoading && !error && generatedImage && (
            <div className="w-full h-full flex flex-col">
              {console.log('🖼️ TryOn: Rendering generated image:', {
                imageUrl: generatedImage.imageUrl.substring(0, 50) + '...',
                altText: generatedImage.altText
              })}
              <img 
                src={generatedImage.imageUrl} 
                alt={generatedImage.altText} 
                className="w-full h-full object-contain rounded-lg flex-grow border border-gray-200"
                onLoad={() => console.log('✅ TryOn: Image loaded successfully')}
                onError={(e) => console.error('❌ TryOn: Image failed to load:', e)}
              />
              <a 
                href={generatedImage.imageUrl} 
                download="fashion-tryon.png"
                className="mt-4 w-full text-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Download Image
              </a>
            </div>
          )}
          
          {!isLoading && !error && !generatedImage && (
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium mb-2">Your try-on result will appear here</p>
              <p className="text-sm">Upload your photo and a garment image, then click "Try On Outfit" to see how it looks on you.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Debug Panel - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <DebugPanel 
          userImage={userImage}
          garmentImage={garmentImage}
          generatedImage={generatedImage}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};