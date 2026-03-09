'use client';

import { useCallback, useState } from 'react';

type SharePayload = {
  url: string;
  title?: string;
  text?: string;
};

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'error';

const copyToClipboard = async (text: string): Promise<void> => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};

export const useShare = () => {
  const [isSharing, setIsSharing] = useState(false);

  const share = useCallback(
    async ({ url, title, text }: SharePayload): Promise<ShareResult> => {
      if (isSharing) return 'cancelled';

      try {
        setIsSharing(true);

        if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
          await navigator.share({ url, title, text });
          return 'shared';
        }

        await copyToClipboard(url);
        return 'copied';
      } catch (error) {
        const message = error instanceof Error ? error.message : '';
        if (message.toLowerCase().includes('abort')) return 'cancelled';
        return 'error';
      } finally {
        setIsSharing(false);
      }
    },
    [isSharing]
  );

  return { isSharing, share };
};

