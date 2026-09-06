'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// 10 minutes total inactivity timeout
const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000;
// Show warning modal 60 seconds before auto-logout
const WARNING_THRESHOLD_MS = 60 * 1000;
// Key used across tabs in localStorage
const STORAGE_KEY = 'matrimony_last_activity';

export function InactivityHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  const lastActivityRef = useRef<number>(Date.now());
  const isLoggedOutRef = useRef<boolean>(false);

  // Update activity timestamp in state and sync across browser tabs
  const recordActivity = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, now.toString());
      } catch {
        // Ignored
      }
    }
    // If the warning dialog is open and the user acts, dismiss it
    setShowWarning(false);
  }, []);

  // Perform secure client logout
  const handleLogout = useCallback(() => {
    if (isLoggedOutRef.current) return;
    isLoggedOutRef.current = true;
    setShowWarning(false);

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignored
      }
    }

    router.push('/login?reason=inactivity');
  }, [router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Do not run inactivity tracking on public auth pages
    const isPublicPage =
      pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/verify' ||
      pathname === '/forgot-password' ||
      pathname === '/about' ||
      pathname === '/';

    const hasToken = !!(localStorage.getItem('access_token') || localStorage.getItem('token'));
    if (!hasToken || isPublicPage) {
      setShowWarning(false);
      return;
    }

    isLoggedOutRef.current = false;

    // Initialize last activity timestamp
    const stored = localStorage.getItem(STORAGE_KEY);
    const initialTime = stored ? parseInt(stored, 10) : Date.now();
    lastActivityRef.current = isNaN(initialTime) ? Date.now() : initialTime;
    localStorage.setItem(STORAGE_KEY, lastActivityRef.current.toString());

    // Throttled activity listener
    let throttleTimer: NodeJS.Timeout | null = null;
    const handleUserInteraction = () => {
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          recordActivity();
          throttleTimer = null;
        }, 1000);
      }
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach((event) => {
      window.addEventListener(event, handleUserInteraction, { passive: true });
    });

    // Check inactivity every 1 second
    const interval = setInterval(() => {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      if (!token) return;

      const storedTimeStr = localStorage.getItem(STORAGE_KEY);
      const lastActive = storedTimeStr ? parseInt(storedTimeStr, 10) : lastActivityRef.current;
      const now = Date.now();
      const elapsed = now - (isNaN(lastActive) ? now : lastActive);

      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        handleLogout();
      } else if (elapsed >= INACTIVITY_TIMEOUT_MS - WARNING_THRESHOLD_MS) {
        const remaining = Math.max(0, Math.ceil((INACTIVITY_TIMEOUT_MS - elapsed) / 1000));
        setSecondsRemaining(remaining);
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserInteraction);
      });
      if (throttleTimer) clearTimeout(throttleTimer);
      clearInterval(interval);
    };
  }, [pathname, recordActivity, handleLogout]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-amber-950/40 text-center">
        {/* Animated Warning Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-inner">
          <svg
            className="w-7 h-7 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mb-2">
          Session Expiring Soon
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
          You have been inactive. For your privacy and account security, you will be automatically logged out in:
        </p>

        {/* Circular Countdown Badge */}
        <div className="inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono font-extrabold text-2xl tracking-wider mb-6 shadow-md">
          {secondsRemaining}s
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={recordActivity}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-950/40 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            Stay Signed In
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            Log Out Now
          </button>
        </div>
      </div>
    </div>
  );
}
