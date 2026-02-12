import { useState, useCallback, useRef } from "react";

export function useAudioEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);

  const play = useCallback(
    async (action: () => Promise<(() => void) | void>, durationMs?: number) => {
      if (cancelRef.current) {
        cancelRef.current();
      }
      setIsPlaying(true);
      const cancel = await action();
      cancelRef.current = cancel ?? null;

      if (durationMs) {
        setTimeout(() => {
          setIsPlaying(false);
          cancelRef.current = null;
        }, durationMs);
      }
    },
    [],
  );

  const stop = useCallback(() => {
    if (cancelRef.current) {
      cancelRef.current();
      cancelRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  return { isPlaying, play, stop };
}
