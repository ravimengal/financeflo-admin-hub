import { useState, useEffect, useCallback } from 'react';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export function useSessionExpiry() {
  const [isExpired, setIsExpired] = useState(false);

  const resetTimer = useCallback(() => {
    setIsExpired(false);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const resetTimeout = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setIsExpired(true), SESSION_TIMEOUT);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetTimeout));
    resetTimeout();

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, resetTimeout));
    };
  }, []);

  const handleRefresh = useCallback(() => {
    // In a real app, call your token refresh endpoint here
    resetTimer();
  }, [resetTimer]);

  const handleLogout = useCallback(() => {
    // In a real app, clear auth state and redirect to login
    window.location.href = '/';
  }, []);

  return { isExpired, handleRefresh, handleLogout };
}
