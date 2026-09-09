'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../../lib/api-client';
import { ProfilePhotoItem } from '../../../types';
import { getPhotoUrl, DEFAULT_AVATAR_SVG } from '../../../lib/utils';

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
    <div className="bg-[#fdfbf7] min-h-screen py-10 text-charcoal-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#ece2d1] rounded-3xl p-8 shadow-sm">
          {/* Top Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#ece2d1] gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700 block mb-1">
                Profile Media Manager
              </span>
              <h1 className="text-2xl font-serif font-extrabold text-charcoal-900">
                Manage Profile Photos
              </h1>
              <p className="text-xs text-charcoal-600 mt-1">
                A minimum of 5 photos is required for profile verification and community discoverability.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                hasMin5
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-gold-50 text-gold-900 border-gold-200'
              }`}>
                {photos.length} of 5 Photos Uploaded
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 font-medium">
              {error}
            </div>
          )}

          {/* Photo Grid */}
          <div className="py-6">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="aspect-square bg-[#faf6ee] border border-[#ece2d1] rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {photos.map((p) => (
                  <div
                    key={p.id}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 group bg-[#faf6ee] ${
                      p.is_primary ? 'border-burgundy-700 ring-2 ring-burgundy-600/20 shadow-sm' : 'border-[#ece2d1]'
                    }`}
                  >
                    <img
                      src={getPhotoUrl(p.r2_url) || DEFAULT_AVATAR_SVG}
                      alt="Uploaded photo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR_SVG;
                      }}
                    />

                    {p.is_primary && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-gold-200 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs border border-gold-400/30">
                        Primary
                      </div>
                    )}

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-charcoal-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      {!p.is_primary && (
                        <button
                          onClick={() => handleSetPrimary(p.id)}
                          className="w-full py-1.5 text-[11px] font-bold rounded-lg bg-white text-charcoal-900 hover:bg-[#faf6ee] transition-colors"
                        >
                          Set Primary
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="w-full py-1.5 text-[11px] font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {/* Upload Placeholder Tile */}
                <label className="aspect-square rounded-2xl border-2 border-dashed border-[#ded0ba] hover:border-burgundy-600 bg-[#faf6ee] hover:bg-gold-50/40 flex flex-col items-center justify-center p-4 cursor-pointer transition-all">
                  <span className="text-xs font-bold text-burgundy-700 mb-1">
                    {uploading ? 'Processing...' : '+ Add Photo'}
                  </span>
                  <span className="text-[10px] text-charcoal-500 text-center leading-tight">
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
          <div className="pt-6 border-t border-[#ece2d1] flex items-center justify-between">
            <Link href="/verification-status" className="text-xs font-bold text-burgundy-700 hover:underline">
              ← Check Verification Status
            </Link>
            <Link
              href="/discover"
              className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white text-xs font-extrabold px-6 py-3 rounded-xl shadow-md transition-all"
            >
              Browse Matches →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
