import React, { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  overlayClassName?: string;
  fallbackImage?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '21/9';
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  className = '',
  overlayClassName = '',
  fallbackImage = '',
  aspectRatio = '16/9',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleError = () => {
      setError(true);
      console.error('Erreur lors du chargement de la vidéo:', src);
    };

    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('error', handleError);
    };
  }, [src]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const aspectRatioClass = {
    '16/9': 'aspect-video', // 16:9
    '4/3': 'aspect-[4/3]',  // 4:3
    '1/1': 'aspect-square', // 1:1
    '21/9': 'aspect-[21/9]', // 21:9 (ultrawide)
  }[aspectRatio];

  if (error && fallbackImage) {
    return (
      <div className={`relative overflow-hidden ${aspectRatioClass} ${className}`}>
        <img
          src={fallbackImage}
          alt="Vidéo non disponible"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectRatioClass} ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        controls={controls}
        onClick={togglePlay}
      >
        <source src={src} type={`video/${src.split('.').pop()}`} />
        Votre navigateur ne prend pas en charge la lecture de vidéos.
      </video>

      {!controls && (
        <div
          className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer ${overlayClassName}`}
          onClick={togglePlay}
        >
          {!isPlaying && (
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
