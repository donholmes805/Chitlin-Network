/**
 * Chitlin Network TV - Branded Media Placeholders
 * This file provides culturally aligned fallback images and gradients for missing media assets.
 */

export const PLACEHOLDER_CATEGORIES = {
  JAZZ: {
    label: 'Jazz Lounge',
    gradient: 'from-[#1a1a1a] via-[#2c241c] to-[#080808]',
    icon: 'queue_music',
    overlayText: 'Soul of the South'
  },
  BLUES: {
    label: 'Blues Stage',
    gradient: 'from-[#080808] via-[#1c202c] to-[#050505]',
    icon: 'music_note',
    overlayText: 'Authentic Blues'
  },
  GOSPEL: {
    label: 'Gospel Stage',
    gradient: 'from-[#2c241c] via-[#f2ca50]/10 to-[#080808]',
    icon: 'auto_awesome',
    overlayText: 'Spirit & Song'
  },
  NEWS: {
    label: 'Community Newsroom',
    gradient: 'from-[#101010] via-[#23201d] to-[#080808]',
    icon: 'newspaper',
    overlayText: 'Truth & Voice'
  },
  SPORTS: {
    label: 'Sports Desk',
    gradient: 'from-[#080808] via-[#8c6239]/20 to-[#050505]',
    icon: 'sports_basketball',
    overlayText: 'Game Day'
  },
  CINEMA: {
    label: 'Independent Cinema',
    gradient: 'from-[#000000] via-[#b10f0f]/10 to-[#080808]',
    icon: 'movie',
    overlayText: 'Black Stories'
  },
  LEGACY: {
    label: 'Greenwood Legacy',
    gradient: 'from-[#1a1a1a] via-[#8c6239]/40 to-[#080808]',
    icon: 'history_edu',
    overlayText: 'Built on Legacy'
  },
  SOUTHERN: {
    label: 'Southern Culture',
    gradient: 'from-[#101010] via-[#c8b892]/10 to-[#080808]',
    icon: 'restaurant',
    overlayText: 'Heritage & Heart'
  },
  CREATOR: {
    label: 'Creator Studio',
    gradient: 'from-[#181818] via-[#f2ca50]/5 to-[#080808]',
    icon: 'videocam',
    overlayText: 'Independent Media'
  }
};

export type PlaceholderCategory = keyof typeof PLACEHOLDER_CATEGORIES;

export function getPlaceholderByCategory(category?: string): typeof PLACEHOLDER_CATEGORIES['CREATOR'] {
  const cat = (category?.toUpperCase() as PlaceholderCategory) || 'CREATOR';
  return PLACEHOLDER_CATEGORIES[cat] || PLACEHOLDER_CATEGORIES.CREATOR;
}

/**
 * Branded placeholder images (using stylized gradients and icons)
 */
export const BRAND_FALLBACKS = {
  CHANNEL: 'https://images.unsplash.com/photo-1514525253361-bee8a48740d7?q=80&w=2000&auto=format&fit=crop', // Jazz Club
  SHOW: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop', // Film
  EPISODE: 'https://images.unsplash.com/photo-1598897349489-4476ceaf131c?q=80&w=2000&auto=format&fit=crop', // Studio
  LIVE: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000&auto=format&fit=crop', // Audience
};
