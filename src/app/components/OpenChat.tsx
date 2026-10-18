'use client';

import type { ReactNode } from 'react';
import { liveChatEnabled } from '@/app/config/contact';

declare global {
  interface Window {
    // Defined by the Smartsupp snippet in layout.tsx; calls are queued until the chat has loaded.
    smartsupp?: (command: string) => void;
  }
}

// Opens the Smartsupp chat window. When live chat is turned off it renders `fallback`
// (by default the plain children, so sentences like "use live chat" still read correctly).
export default function OpenChat({
  children,
  className = '',
  fallback,
}: {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
}) {
  if (!liveChatEnabled) {
    return <>{fallback === undefined ? children : fallback}</>;
  }
  return (
    <button type="button" onClick={() => window.smartsupp?.('chat:open')} className={className}>
      {children}
    </button>
  );
}
