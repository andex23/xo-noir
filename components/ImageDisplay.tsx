import React, { useState, useEffect } from 'react';

interface ImageDisplayProps {
  imageUrl: string | null;
  altText?: string;
  showPlaceholder?: boolean;
  placeholderText?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  imageUrl, 
  altText = "Visual Evidence", 
  showPlaceholder = false,
  placeholderText = "Visual data incoming..."
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setIsLoading(true);
      setHasError(false);
    } else {
      setIsLoading(false); 
    }
  }, [imageUrl]);

  if (!imageUrl) {
    if (showPlaceholder) {
      return (
        <div className="w-full aspect-video bg-neutral-800/70 rounded-lg shadow-lg flex flex-col items-center justify-center text-neutral-500 border border-neutral-700/80 p-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-16 h-16 opacity-40 mb-3 text-purple-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5L1.5 21m5.159-9.841a2.25 2.25 0 0 1 3.182 0L15 14.25M9 10.5l1.303-1.303a.75.75 0 0 1 1.061 0l3.455 3.455" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 21 17.31 17.31M3 3l3.344 3.344" />
          </svg>
          <p className="text-sm italic">{placeholderText}</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="w-full aspect-[16/9] bg-neutral-900 rounded-lg shadow-xl overflow-hidden border border-neutral-700/60 relative">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/90 z-10 backdrop-blur-sm">
          <svg className="animate-spin h-10 w-10 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-3 text-sm text-neutral-400">Rendering visual feed...</p>
        </div>
      )}
      {hasError && !isLoading && (
         <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/95 text-red-400 p-4">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-2 opacity-70">
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
           </svg>
           <p className="text-sm">Visual feed corrupted.</p>
           <p className="text-xs text-neutral-500">Fallback may be active.</p>
         </div>
      )}
      <img
        src={imageUrl}
        alt={altText}
        className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isLoading || (hasError && !imageUrl.startsWith('https://picsum.photos')) ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => { setIsLoading(false); setHasError(true); }}
        style={{ display: (hasError && !imageUrl.startsWith('https://picsum.photos')) ? 'none' : 'block' }}
      />
    </div>
  );
};

export default ImageDisplay;