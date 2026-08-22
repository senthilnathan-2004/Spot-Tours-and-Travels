import React, { useState, useRef } from 'react';
import { MdCloudUpload, MdLink, MdDelete, MdImage, MdCheckCircle, MdPhotoSizeSelectActual } from 'react-icons/md';
import './AdminImageUpload.css';

/**
 * Compresses an image file in the browser before setting as DataURL
 * Keeps aspect ratio, caps max dimension to 1400px, converts to JPEG 0.88 quality
 */
async function compressImageFile(file, maxWidth = 1400, quality = 0.88) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export default function AdminImageUpload({
  label = 'Image',
  value = '',
  onChange,
  helpText = '',
  placeholder = 'https://images.unsplash.com/...',
  previewHeight = 160,
  aspectRatio = '16/9'
}) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP, etc.)');
      return;
    }

    // Limit original file size to 25MB before compression
    if (file.size > 25 * 1024 * 1024) {
      setError('Image file is too large (max 25MB).');
      return;
    }

    setError('');
    setProcessing(true);
    try {
      const compressedDataUrl = await compressImageFile(file);
      onChange(compressedDataUrl);
    } catch (err) {
      setError('Error processing image: ' + err.message);
    } finally {
      setProcessing(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  return (
    <div className="adm-img-upload-root">
      <div className="adm-img-upload-header">
        <label className="adm-img-upload-label">
          <MdPhotoSizeSelectActual className="adm-img-label-icon" />
          {label}
        </label>
        
        {/* Toggle Mode: File Upload vs URL */}
        <div className="adm-img-mode-pills">
          <button
            type="button"
            className={`adm-img-mode-btn ${mode === 'upload' ? 'is-active' : ''}`}
            onClick={() => setMode('upload')}
          >
            <MdCloudUpload /> Choose File
          </button>
          <button
            type="button"
            className={`adm-img-mode-btn ${mode === 'url' ? 'is-active' : ''}`}
            onClick={() => setMode('url')}
          >
            <MdLink /> Paste URL
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      {mode === 'upload' && (
        <div
          className={`adm-img-dropzone ${dragActive ? 'is-dragging' : ''} ${processing ? 'is-processing' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <div className="adm-img-dropzone-content">
            <div className="adm-img-dropzone-icon">
              {processing ? (
                <div className="adm-img-spinner" />
              ) : (
                <MdCloudUpload />
              )}
            </div>
            <div className="adm-img-dropzone-text">
              <strong>{processing ? 'Compressing & Preparing Image…' : 'Click to Browse or Drag & Drop'}</strong>
              <span>Supports JPG, PNG, WEBP, HEIC (Auto-optimized for web)</span>
            </div>
          </div>
        </div>
      )}

      {/* URL Input */}
      {mode === 'url' && (
        <div className="adm-img-url-wrap">
          <input
            type="url"
            className="adm-input adm-img-url-input"
            value={value && !value.startsWith('data:') ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        </div>
      )}

      {error && <div className="adm-img-error-msg">{error}</div>}

      {/* Image Preview Box */}
      {value && (
        <div className="adm-img-preview-card" style={{ height: previewHeight }}>
          <img src={value} alt="Preview" className="adm-img-preview-tag" />
          <div className="adm-img-preview-overlay">
            <div className="adm-img-preview-info">
              <span className="adm-img-badge-success">
                <MdCheckCircle /> Ready
              </span>
            </div>
            <div className="adm-img-preview-actions">
              <button
                type="button"
                className="adm-img-action-btn adm-img-action-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                title="Remove Image"
              >
                <MdDelete /> Remove
              </button>
              <button
                type="button"
                className="adm-img-action-btn adm-img-action-replace"
                onClick={(e) => {
                  e.stopPropagation();
                  if (mode === 'upload') {
                    fileInputRef.current?.click();
                  } else {
                    const newUrl = prompt('Enter new image URL:', value.startsWith('data:') ? '' : value);
                    if (newUrl !== null) onChange(newUrl);
                  }
                }}
                title="Replace Image"
              >
                <MdCloudUpload /> Replace
              </button>
            </div>
          </div>
        </div>
      )}

      {helpText && <div className="adm-img-help-text">{helpText}</div>}
    </div>
  );
}
