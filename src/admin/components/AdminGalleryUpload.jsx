import React, { useRef, useState } from 'react';
import { MdAddPhotoAlternate, MdDelete, MdCloudUpload, MdLink, MdCollections } from 'react-icons/md';
import './AdminGalleryUpload.css';

async function compressImageFile(file, maxWidth = 1400, quality = 0.86) {
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
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function AdminGalleryUpload({
  label = 'Package Gallery Photos',
  gallery = [],
  onChange
}) {
  const [urlInput, setUrlInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);

  async function handleFiles(files) {
    if (!files || files.length === 0) return;
    setProcessing(true);
    try {
      const newUrls = [];
      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/')) {
          const compressed = await compressImageFile(file);
          newUrls.push(compressed);
        }
      }
      onChange([...gallery, ...newUrls]);
    } catch (err) {
      alert('Error uploading gallery photos: ' + err.message);
    } finally {
      setProcessing(false);
    }
  }

  function handleAddUrl() {
    if (!urlInput.trim()) return;
    onChange([...gallery, urlInput.trim()]);
    setUrlInput('');
  }

  function handleRemove(index) {
    const updated = gallery.filter((_, i) => i !== index);
    onChange(updated);
  }

  return (
    <div className="adm-gallery-upload-root">
      <div className="adm-gallery-header">
        <label className="adm-gallery-label">
          <MdCollections className="adm-gallery-label-icon" />
          {label} ({gallery.length})
        </label>

        <div className="adm-gallery-actions-top">
          <button
            type="button"
            className="adm-gallery-btn-upload"
            onClick={() => fileInputRef.current?.click()}
            disabled={processing}
          >
            <MdCloudUpload /> {processing ? 'Compressing…' : 'Upload Photos'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFiles(e.target.files)}
            multiple
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* URL input bar for gallery */}
      <div className="adm-gallery-url-bar">
        <input
          type="url"
          className="adm-input adm-gallery-url-input"
          placeholder="Or paste an image URL and click Add..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddUrl();
            }
          }}
        />
        <button
          type="button"
          className="adm-btn adm-btn-ghost adm-gallery-add-url-btn"
          onClick={handleAddUrl}
        >
          <MdLink /> Add URL
        </button>
      </div>

      {/* Gallery Grid */}
      {gallery.length > 0 ? (
        <div className="adm-gallery-grid">
          {gallery.map((imgUrl, idx) => (
            <div key={idx} className="adm-gallery-item">
              <img src={imgUrl} alt={`Gallery item ${idx + 1}`} className="adm-gallery-thumb" />
              <button
                type="button"
                className="adm-gallery-item-remove"
                onClick={() => handleRemove(idx)}
                title="Remove photo"
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="adm-gallery-empty">
          <span>No additional gallery photos added yet. Upload from device or add URLs.</span>
        </div>
      )}
    </div>
  );
}
