'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../../lib/api-client';
import { ProfilePhotoItem } from '../../../types';
import { getPhotoUrl } from '../../../lib/utils';

export default function ProfilePhotosPage() {
  const [photos, setPhotos] = useState<ProfilePhotoItem[]>([]);
  const [hasMin5, setHasMin5] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPhotos = async () => {
    try {
      const data = await apiClient.getMyPhotos();
      setPhotos(data.photos || []);
      setHasMin5(data.has_min_5);
    } catch (err: any) {
      setError(err.message || 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await apiClient.uploadPhoto(file, photos.length === 0);
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
      await loadPhotos();
    } catch (err: any) {
      setError(err.message || 'Failed to set primary photo');
    }
  };

  const handleDelete = async (photoId: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      await apiClient.deletePhoto(photoId);
      await loadPhotos();
    } catch (err: any) {
      setError(err.message || 'Failed to delete photo');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
          {/* Top Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
                Profile Media Manager
              </span>
              <h1 className="text-2xl font-bold text-slate-900">
                Manage Profile Photos
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                A minimum of 5 photos is required for profile verification and discoverability.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-md ${
                hasMin5
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {photos.length} of 5 Photos Uploaded
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
              {error}
            </div>
          )}

          {/* Photo Grid */}
          <div className="py-6">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="aspect-square bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {photos.map((p) => (
                  <div
                    key={p.id}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 group bg-slate-100 ${
                      p.is_primary ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'
                    }`}
                  >
                    <img
                      src={getPhotoUrl(p.r2_url)}
                      alt="Uploaded photo"
                      className="w-full h-full object-cover"
                    />

                    {p.is_primary && (
                      <div className="absolute top-2 left-2 bg-blue-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        Primary
                      </div>
                    )}

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      {!p.is_primary && (
                        <button
                          onClick={() => handleSetPrimary(p.id)}
                          className="w-full py-1 text-[10px] font-semibold rounded bg-white text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                          Set Primary
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="w-full py-1 text-[10px] font-semibold rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {/* Upload Placeholder Tile */}
                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-600 bg-slate-50 hover:bg-blue-50/50 flex flex-col items-center justify-center p-4 cursor-pointer transition-all">
                  <span className="text-xs font-bold text-blue-700 mb-1">
                    {uploading ? 'Processing...' : '+ Add Photo'}
                  </span>
                  <span className="text-[10px] text-slate-400 text-center leading-tight">
                    JPG or PNG (Auto-compressed)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link href="/verification-status" className="text-xs font-semibold text-blue-700 hover:underline">
              ← Check Verification Status
            </Link>
            <Link
              href="/discover"
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-xs transition-colors"
            >
              Browse Matches
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
