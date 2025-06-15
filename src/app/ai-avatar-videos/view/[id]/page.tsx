'use client';

import dynamic from 'next/dynamic';

const VideoViewPage = dynamic(
  () => import('./VideoViewPageClient'),
  { ssr: false }
);

export default VideoViewPage;