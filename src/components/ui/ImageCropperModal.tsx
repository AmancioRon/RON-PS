import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Modal } from './Modal';
import { getCroppedImg } from '../../lib/cropImage';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
}

export function ImageCropperModal({ isOpen, onClose, imageSrc, onCropComplete }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adjust Profile Picture">
      <div className="relative w-full h-64 bg-black rounded-xl overflow-hidden mb-4">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-text-secondary mb-2">Zoom</label>
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full accent-accent-blue"
        />
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 bg-surface border border-surface-border text-white rounded-xl font-medium hover:bg-surface-hover transition-colors">
          Cancel
        </button>
        <button onClick={handleSave} disabled={isProcessing} className="flex-1 py-2.5 bg-accent-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50">
          {isProcessing ? 'Saving...' : 'Save'}
        </button>
      </div>
    </Modal>
  );
}
