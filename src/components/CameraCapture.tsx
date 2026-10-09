import React, { useRef, useState, useEffect } from 'react';
import { CameraIcon, CameraSwitchIcon, CrossIcon, UploadIcon, RefreshCwIcon } from './icons';
import { preprocessImage } from '../utils/image';
import { triggerHaptic } from '../utils/audio';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onCancel: () => void;
  title?: string;
  hint?: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onCancel,
  title = 'Photograph Room',
  hint = 'Ensure good lighting and capture the widest room angle.',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasCameraAccess, setHasCameraAccess] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize camera stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function initCamera() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setHasCameraAccess(false);
          return;
        }

        // Stop any previous stream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }

        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        currentStream = newStream;
        setStream(newStream);
        setHasCameraAccess(true);

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn('Camera access unavailable or denied:', err);
        setHasCameraAccess(false);
      }
    }

    initCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const handleToggleFacingMode = () => {
    triggerHaptic(15);
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleSnap = async () => {
    if (!videoRef.current || isProcessing) return;
    setIsProcessing(true);
    triggerHaptic([30, 20, 40]);

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // If front camera, unmirror
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      const rawDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      // Preprocess downscale to 1024px
      const blob = await (await fetch(rawDataUrl)).blob();
      const compressed = await preprocessImage(blob);

      // Stop camera tracks
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }

      onCapture(compressed);
    } catch (err) {
      console.error('Snap error:', err);
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    triggerHaptic(20);
    try {
      const compressed = await preprocessImage(file);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      onCapture(compressed);
    } catch (err) {
      console.error('File load error:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between select-none">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent z-10">
        <button
          type="button"
          onClick={() => {
            if (stream) stream.getTracks().forEach((t) => t.stop());
            onCancel();
          }}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/90 active:scale-95 transition-transform"
          aria-label="Cancel capture"
        >
          <CrossIcon size={20} />
        </button>

        <div className="text-center px-2">
          <h2 className="text-sm font-semibold tracking-wide text-white">{title}</h2>
          <p className="text-[11px] text-white/60 truncate max-w-[220px]">{hint}</p>
        </div>

        {hasCameraAccess ? (
          <button
            type="button"
            onClick={handleToggleFacingMode}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/90 active:scale-95 transition-transform"
            aria-label="Switch camera"
          >
            <CameraSwitchIcon size={20} />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-zinc-950">
        {hasCameraAccess ? (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
            {/* Viewfinder crosshairs */}
            <div className="absolute inset-8 border border-white/20 rounded-2xl pointer-events-none flex flex-col justify-between p-4">
              <div className="flex justify-between">
                <div className="w-4 h-4 border-t-2 border-l-2 border-violet-400" />
                <div className="w-4 h-4 border-t-2 border-r-2 border-violet-400" />
              </div>
              <div className="flex justify-between">
                <div className="w-4 h-4 border-b-2 border-l-2 border-violet-400" />
                <div className="w-4 h-4 border-b-2 border-r-2 border-violet-400" />
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 text-center max-w-sm flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-violet-400 mb-4">
              <CameraIcon size={32} />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Direct Camera Unavailable</h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Use your device photo library or file selector to submit a room photo.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-xl bg-violet-600 text-white font-medium text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <UploadIcon size={18} />
              Choose Photo File
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-30">
            <RefreshCwIcon size={28} className="animate-spin text-violet-400" />
            <p className="text-sm font-mono text-zinc-300">Optimizing resolution...</p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="px-6 py-6 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-around z-10">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex flex-col items-center justify-center text-white/80 active:scale-95 transition-transform"
          aria-label="Upload photo"
        >
          <UploadIcon size={20} />
          <span className="text-[9px] font-mono mt-0.5">FILE</span>
        </button>

        {hasCameraAccess ? (
          <button
            type="button"
            onClick={handleSnap}
            disabled={isProcessing}
            className="w-20 h-20 rounded-full border-4 border-white/80 p-1 flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Take picture"
          >
            <div className="w-full h-full rounded-full bg-white hover:bg-zinc-200 transition-colors shadow-lg shadow-white/20" />
          </button>
        ) : (
          <div className="w-20" />
        )}

        <div className="w-12" />
      </div>
    </div>
  );
};
