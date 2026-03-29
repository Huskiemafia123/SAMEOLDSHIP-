import React, { useMemo } from 'react';

interface LogoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  tintColor?: string;
  onError?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ src, className, style, tintColor, onError }) => {
  const fileType = useMemo(() => {
    if (!src) return 'unknown';
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
          onError={onError}
          onLoadedData={(e) => {
            // Ensure video is actually playing
            const video = e.target as HTMLVideoElement;
            video.play().catch(() => {
              console.warn("Autoplay prevented for logo video");
            });
          }}
        />
      </div>
    );
  }

  // For images and SVGs, we use the mask approach if tintColor is provided
  // This allows silhouettes to be colored dynamically.
  // If tintColor is explicitly null or undefined, we might want to show original colors.
  // However, the current app relies on tinting for branding.
  
  return (
    <div className={className} style={containerStyle}>
      {tintColor && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ 
            backgroundColor: tintColor,
            maskImage: `url(${src})`,
            WebkitMaskImage: `url(${src})`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            zIndex: 1
          }}
        />
      )}
      <img 
        src={src} 
        alt="Logo" 
        className={`w-full h-full object-contain ${tintColor ? 'opacity-0' : 'opacity-100'}`}
        onError={onError}
        style={{ position: 'relative', zIndex: 0 }}
      />
    </div>
  );
};
