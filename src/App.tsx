import React, { useState } from 'react';
import { TryOn } from './components/TryOn';
import { Pose } from './components/Pose';
import type { ImageData, GeneratedImage } from './types';

const TABS = [
  { 
    name: 'Try-On', 
    icon: '👗',
    description: 'See how clothes look on you with AI-powered virtual try-on technology.' 
  },
  { 
    name: 'Pose', 
    icon: '🕺',
    description: 'Transform poses in fashion photos while maintaining clothing and identity.' 
  },
];

const App: React.FC = () => {
  console.log('🎨 App: Component initializing...');
  
  const [activeTab, setActiveTab] = useState<string>('Try-On');

  // Try-On state
  const [tryOnUserImage, setTryOnUserImage] = useState<ImageData | null>(null);
  const [tryOnGarmentImage, setTryOnGarmentImage] = useState<ImageData | null>(null);
  const [tryOnGeneratedImage, setTryOnGeneratedImage] = useState<GeneratedImage | null>(null);

  // Pose state
  const [poseSourceImage, setPoseSourceImage] = useState<ImageData | null>(null);
  const [poseReferenceImage, setPoseReferenceImage] = useState<ImageData | null>(null);
  const [poseGeneratedImage, setPoseGeneratedImage] = useState<GeneratedImage | null>(null);

  const handleTryOnGenerated = (image: GeneratedImage) => {
    console.log('🎯 App: handleTryOnGenerated called with:', {
      hasImage: !!image,
      imageUrlLength: image?.imageUrl?.length,
      altText: image?.altText
    });
    
    setTryOnGeneratedImage(image);
    console.log('✅ App: Try-on generated image state updated');
    
    // Auto-populate pose source with try-on result
    try {
      const imageData: ImageData = {
        base64: image.imageUrl.split(',')[1],
        mimeType: 'image/png',
        name: 'tryon-result.png'
      };
      setPoseSourceImage(imageData);
      console.log('✅ App: Pose source image auto-populated from try-on result');
    } catch (error) {
      console.error('❌ App: Error auto-populating pose source:', error);
    }
  };

  const handlePoseGenerated = (image: GeneratedImage) => {
    console.log('🕺 App: handlePoseGenerated called with:', {
      hasImage: !!image,
      imageUrlLength: image?.imageUrl?.length,
      altText: image?.altText
    });
    
    setPoseGeneratedImage(image);
    console.log('✅ App: Pose generated image state updated');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Try-On':
        return (
          <TryOn 
            onImageGenerated={handleTryOnGenerated}
            userImage={tryOnUserImage}
            onUserImageUpload={setTryOnUserImage}
            garmentImage={tryOnGarmentImage}
            onGarmentImageUpload={setTryOnGarmentImage}
            generatedImage={tryOnGeneratedImage}
            onClearGeneratedImage={() => {
              console.log('🗑️ App: Clearing try-on generated image');
              setTryOnGeneratedImage(null);
            }}
          />
        );
      case 'Pose':
        return (
          <Pose 
            sourceImage={poseSourceImage}
            onSourceImageUpload={setPoseSourceImage}
            poseImage={poseReferenceImage}
            onPoseImageUpload={setPoseReferenceImage}
            onImageGenerated={handlePoseGenerated}
            generatedImage={poseGeneratedImage}
            onClearGeneratedImage={() => {
              console.log('🗑️ App: Clearing pose generated image');
              setPoseGeneratedImage(null);
            }}
          />
        );
      default:
        return null;
    }
  };

  const activeTabInfo = TABS.find(tab => tab.name === activeTab);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 antialiased">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white p-4 border-r border-gray-200 flex flex-col">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">FS</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Fashion Studio</h1>
            <p className="text-xs text-gray-500">AI-Powered Try-On</p>
          </div>
        </div>
        
        <nav className="flex flex-col gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                console.log(`📝 App: Tab changed to: ${tab.name}`);
                setActiveTab(tab.name);
              }}
              className={`flex items-center gap-3 w-full p-4 rounded-xl text-left text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-white ${
                activeTab === tab.name
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              aria-current={activeTab === tab.name ? 'page' : undefined}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Professional Fashion AI</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Powered by advanced AI for e-commerce and retail applications. 
              Generate realistic try-on experiences for your customers.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="p-6 sm:p-8 lg:p-12 flex-grow">
          {activeTabInfo && (
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{activeTabInfo.icon}</span>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                    {activeTabInfo.name}
                  </h2>
                  <p className="mt-2 text-lg text-gray-600 max-w-3xl">
                    {activeTabInfo.description}
                  </p>
                </div>
              </div>
              
              {activeTab === 'Try-On' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-blue-900">Professional E-commerce Quality</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        Our AI generates realistic try-on images suitable for fashion retail and shopping applications. 
                        Perfect for helping customers visualize how clothes will look on them.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </header>
          )}
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default App;