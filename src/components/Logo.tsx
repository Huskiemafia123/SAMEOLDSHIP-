import React, { useMemo, useEffect, useRef } from 'react';
import { Anchor } from 'lucide-react';

interface LogoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  tintColor?: string;
  onError?: () => void;
  onLoad?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ src, className, style, tintColor, onError, onLoad }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [hasError, setHasError] = React.useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  useEffect(() => {
    if (!src && onLoad) {
      onLoad();
    }
    if (imgRef.current && imgRef.current.complete && onLoad) {
      onLoad();
    }
  }, [src, onLoad]);

  const handleLoad = () => {
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    if (onError) onError();
    // Signal loaded even on error to prevent blocking parent UI
    if (onLoad) onLoad();
  };

  const fileType = useMemo(() => {
    if (!src || hasError) return 'unknown';
    const lowerSrc = src.toLowerCase();
    
    // Video detection
    if (
      lowerSrc.includes('video/mp4') || 
      lowerSrc.includes('.mp4') || 
      lowerSrc.includes('.webm') ||
      lowerSrc.includes('video/webm') ||
      lowerSrc.startsWith('data:video/') || 
      (lowerSrc.includes('blob:') && lowerSrc.includes('#t='))
    ) {
      return 'video';
    }

    // SVG detection
    if (lowerSrc.includes('.svg') || lowerSrc.startsWith('data:image/svg+xml')) {
      return 'svg';
    }

    // Default to image
    return 'image';
  }, [src]);

  const containerStyle: React.CSSProperties = {
    ...style,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  };

  if (fileType === 'unknown' || !src || hasError) {
    return (
      <div className={className} style={containerStyle}>
        <Anchor className="text-seafoam/50" size={24} />
      </div>
    );
  }

  if (fileType === 'video') {
    return (
      <div className={className} style={containerStyle}>
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain"
          onError={handleError}
          onLoadedData={(e) => {
            // Ensure video is actually playing
            const video = e.target as HTMLVideoElement;
            video.play().catch(() => {
              console.warn("Autoplay prevented for logo video");
            });
            handleLoad();
          }}
        />
      </div>
    );
  }

  // For images and SVGs, we use the mask approach if tintColor is provided
  // This allows silhouettes to be colored dynamically.
  
  return (
    <div className={className} style={containerStyle}>
      {tintColor ? (
        <>
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: tintColor,
              maskImage: `url("${src}")`,
              WebkitMaskImage: `url("${src}")`,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
              zIndex: 1
            }}
          />
          <img 
            ref={imgRef}
            src={src} 
            alt="Logo Loader" 
            referrerPolicy="no-referrer"
            className="opacity-0 absolute inset-0 w-full h-full object-contain"
            onError={handleError}
            onLoad={handleLoad}
            style={{ zIndex: 0 }}
          />
        </>
      ) : (
        <img 
          ref={imgRef}
          src={src} 
          alt="Logo" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain"
          onError={handleError}
          onLoad={handleLoad}
          style={{ position: 'relative', zIndex: 0 }}
        />
      )}
    </div>
  );
};
