'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';
import { ProfilePhotoItem } from '../../../types';

export default function PhotosManagerPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<ProfilePhotoItem[]>([]);
  const [hasMin5, setHasMin5] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadPhotos = async () => {
    try {
      const data = await apiClient.getMyPhotos();
      setPhotos(data.photos);
      setHasMin5(data.has_min_5);
    } catch (err: any) {
      setError(err.message || 'Failed to load photos');
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      for (let i = 0; i < files.length; i++) {
        await apiClient.uploadPhoto(files[i]);
      }
      setSuccess(`Successfully uploaded ${files.length} photo(s).`);
      await loadPhotos();
    } catch (err: any) {
      setError(err.message || 'Photo upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = async (photoId: number) => {
    try {
      await apiClient.setPrimaryPhoto(photoId);
      setSuccess('Primary profile photo updated.');
      await loadPhotos();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (photoId: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      await apiClient.deletePhoto(photoId);
      setSuccess('Photo removed.');
      await loadPhotos();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Manage Profile Photos</h1>
          <p className="text-sm text-stone-600">
            Upload at least <strong>5 clear photos</strong> of the candidate to submit for pastoral & admin verification.
          </p>
        </div>
        <Link
          href="/verification-status"
          className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold px-3 py-2 rounded-lg"
        >
          Check Verification Status →
        </Link>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm">
          {success}
        </div>
      )}

      {/* Progress banner */}
      <div className={`p-4 rounded-xl mb-6 flex items-center justify-between ${hasMin5 ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-amber-50 border border-amber-200 text-amber-900'}`}>
        <div>
          <h3 className="font-semibold text-sm">
            {hasMin5 ? '✓ Minimum Photos Requirement Fulfilled' : `⚠ ${5 - photos.length} More Photos Required`}
          </h3>
          <p className="text-xs mt-0.5 opacity-90">
            Currently uploaded: <strong>{photos.length} / 5 minimum</strong>. Supported: JPEG, PNG, WebP (Max 10MB each).
          </p>
        </div>
        <label className="cursor-pointer bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold px-4 py-2 rounded-lg inline-block">
          {uploading ? 'Processing...' : '+ Upload Photos'}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {photos.map((photo, idx) => (
          <div
            key={photo.id}
            className={`relative rounded-xl overflow-hidden border-2 bg-stone-100 group aspect-square flex flex-col justify-between ${photo.is_primary ? 'border-amber-700 shadow-md' : 'border-stone-200'}`}
          >
            <img
              src={photo.thumbnail_url || photo.r2_url}
              alt={`Photo ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {photo.is_primary && (
              <span className="absolute top-2 left-2 bg-amber-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                ★ Main Photo
              </span>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {!photo.is_primary && (
                <button
                  onClick={() => handleSetPrimary(photo.id)}
                  className="bg-white/90 hover:bg-white text-stone-900 text-xs px-2.5 py-1.5 rounded font-medium shadow"
                >
                  Set Main
                </button>
              )}
              <button
                onClick={() => handleDelete(photo.id)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-2.5 py-1.5 rounded font-medium shadow"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between border-t border-stone-200 pt-6">
        <Link href="/profile/create" className="text-sm font-medium text-stone-600 hover:text-stone-900">
          ← Back to Profile Wizard
        </Link>
        <Link
          href="/verification-status"
          className="bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-sm"
        >
          Proceed to Verification →
        </Link>
      </div>
    </div>
  );
}
