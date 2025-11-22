import React, { useState, useCallback } from 'react';
import { GeneratedImage, AspectRatio } from './types';
import { generateWallpapers } from './services/gemini';
import { InputSection } from './components/InputSection';
import { ImageGrid } from './components/ImageGrid';
import { FullScreenViewer } from './components/FullScreenViewer';
import { Info } from 'lucide-react';

const App: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputPrompt, setInputPrompt] = useState<string>('');

  const handleGenerate = useCallback(async (prompt: string, aspectRatio: AspectRatio) => {
    setIsGenerating(true);
    setError(null);
    setImages([]); // Clear previous batch to show loading state cleanly
    
    try {
      const newImages = await generateWallpapers(prompt, aspectRatio);
      setImages(newImages);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleRemix = (image: GeneratedImage) => {
    // To remix, we populate the prompt with the image's prompt
    // and close the viewer so the user can tweak it if desired or just re-roll.
    setInputPrompt(image.prompt);
    setSelectedImage(null);
    
    // Optional: Automatically trigger generation? 
    // The user might want to tweak, so we just set the prompt.
    // But usually a "Remix" button implies immediate action or setup.
    // Let's scroll to top.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary-500/30">
      
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-purple-400 bg-clip-text text-transparent tracking-tight">
          VibeWall
        </h1>
      </header>

      {/* Main Controls */}
      <InputSection 
        onGenerate={handleGenerate} 
        isGenerating={isGenerating} 
        initialPrompt={inputPrompt}
      />

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto m-4 p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-start gap-3 text-red-200">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      <main>
        <ImageGrid 
          images={images} 
          onSelect={setSelectedImage} 
          isLoading={isGenerating} 
        />
      </main>

      {/* Full Screen Viewer */}
      <FullScreenViewer 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)}
        onRemix={handleRemix}
      />
    </div>
  );
};

export default App;