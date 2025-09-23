import React, { useState, useCallback } from 'react';
import type { ImageData, GeneratedImage } from '../types';
import { ImageUploader } from './ImageUploader';
import { generatePoseImage } from '../services/openRouterService';

interface PoseProps {
  sourceImage: ImageData | null;
  onSourceImageUpload: (image: ImageData | null) => void;
  poseImage: ImageData | null;
  onPoseImageUpload: (image: ImageData | null) => void;
  onImageGenerated: (image: GeneratedImage) => void;
  generatedImage: GeneratedImage | null;
  onClearGeneratedImage: () => void;
}

export const Pose: React.FC<PoseProps> = ({
  sourceImage,
  onSourceImageUpload,
  poseImage,
  onPoseImageUpload,
  onImageGenerated,
  generatedImage,
  onClearGeneratedImage
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!sourceImage || !poseImage) {
      setError('Please provide both a source image and a pose reference.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    onClearGeneratedImage();

    try {
      const result = await generatePoseImage(sourceImage, poseImage);
      if (result) {
        onImageGenerated(result);
      } else {
        setError('Failed to generate pose image. Please try different images.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [sourceImage, poseImage, onImageGenerated, onClearGeneratedImage]);

  const handleReset = () => {
    onSourceImageUpload(null);
    onPoseImageUpload(null);
    onClearGeneratedImage();
    setError(null);
    setIsLoading(false);
  };

  const canGenerate = sourceImage && poseImage && !isLoading;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Input Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ImageUploader 
            id="source-upload" 
            title="1. Source Image" 
            onImageUpload={onSourceImageUpload} 
            imageData={sourceImage} 
          />
          <ImageUploader 
            id="pose-upload" 
            title="2. Pose Reference" 
            onImageUpload={onPoseImageUpload} 
            imageData={poseImage} 
          />
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full sm:w-auto flex-grow flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {isLoading ? 'Generating...' : 'Generate Pose'}
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
              <p className="mt-4 text-gray-700 font-medium">Transforming pose...</p>
              <p className="text-sm text-gray-500">Creating professional fashion photography.</p>
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
              <img 
                src={generatedImage.imageUrl} 
                alt={generatedImage.altText} 
                className="w-full h-full object-contain rounded-lg flex-grow border border-gray-200"
              />
              <a 
                href={generatedImage.imageUrl} 
                download="fashion-pose.png"
                className="mt-4 w-full text-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Download Image
              </a>
            </div>
          )}
          
          {!isLoading && !error && !generatedImage && (
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-lg font-medium mb-2">Your posed image will appear here</p>
              <p className="text-sm">Upload a source image and pose reference to create professional fashion photography.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};