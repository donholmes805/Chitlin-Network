import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Chitlin’ Network TV',
    short_name: 'Chitlin’ TV',
    description: 'Chitlin’ Network brings pre-recorded shows, live programming, news, sports, music, comedy, and independent channels into one cable-style streaming experience.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#F2CA50',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
