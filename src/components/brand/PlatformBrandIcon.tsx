import React from 'react';
import { ExternalPlatform } from '../../services/validation/externalProfileValidator';

interface PlatformBrandIconProps {
  platform: ExternalPlatform | string;
  className?: string;
  size?: number;
}

export const PlatformBrandIcon: React.FC<PlatformBrandIconProps> = ({
  platform,
  className = 'w-5 h-5',
  size = 20
}) => {
  const norm = (platform || '').toLowerCase();

  if (norm === 'linkedin') {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-label="LinkedIn"
      >
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 0 0 1.66-1.66 1.66 1.66 0 0 0-1.66-1.66 1.66 1.66 0 0 0-1.66 1.66c0 .92.74 1.66 1.66 1.66m1.4 9.74v-8.37H5.06v8.37h2.8Z" />
      </svg>
    );
  }

  if (norm === 'upwork') {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-label="Upwork"
      >
        <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-3.044 0-5.26 2.062-5.917 4.908-1.096-1.603-1.905-3.535-2.316-5.467H7.721v6.79c0 1.579-.908 2.894-2.235 2.894-1.326 0-2.235-1.315-2.235-2.894V4.459H.645v6.79c0 3.018 2.073 5.502 4.841 5.502 2.768 0 4.841-2.484 4.841-5.502v-.838c.38 1.439.996 2.887 1.83 4.195l-1.575 7.422h2.671l1.173-5.526c1.178.788 2.585 1.285 4.135 1.285 3.043 0 5.516-2.473 5.516-5.516 0-3.045-2.474-5.113-5.516-5.113z" />
      </svg>
    );
  }

  if (norm === 'fiverr') {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-label="Fiverr"
      >
        <path d="M23.003 13.914c0 4.97-4.03 9.002-9.003 9.002S4.997 18.884 4.997 13.914s4.03-9.002 9.003-9.002c4.972 0 9.003 4.031 9.003 9.002zM12.92 8.441h-2.1v-.38c0-.68.42-.92 1.05-.92.4 0 .84.08 1.05.15v-1.63c-.45-.1-.97-.16-1.54-.16-1.92 0-2.84 1.02-2.84 2.56v.38H7.32v1.75h1.22v4.88h2.28v-4.88h2.1v-1.75zm3.76 6.63h2.38l-1.54-6.63h-2.14l-1.54 6.63h2.33l.35-1.94h1.81l.35 1.94zm-1.89-3.41.6-3.08.59 3.08h-1.19z" />
      </svg>
    );
  }

  if (norm === 'github') {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-label="GitHub"
      >
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
      </svg>
    );
  }

  // Default: Portfolio / Personal Website Globe
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Website"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
};
