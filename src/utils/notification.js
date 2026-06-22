import { useState, useCallback, useRef, useEffect } from 'react';

export const useNotification = (durationMs = 5000) => {
  const [success, setSuccess] = useState("");
  const timerRef = useRef(null);

  const showSuccess = useCallback((message) => {
    setSuccess(message);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setSuccess("");
    }, durationMs);
  }, [durationMs]);

  const clearSuccess = useCallback(() => {
    setSuccess("");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { success, showSuccess, clearSuccess };
};
