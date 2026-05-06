export type UserRole = 'owner' | 'admin' | 'channel_owner' | 'viewer';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  subscriptionStatus: 'none' | 'basic' | 'premium';
  createdAt: any;
  updatedAt: any;
}

export type ChannelStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'suspended';

export interface Channel {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  logoUrl: string;
  bannerUrl: string;
  posterUrl: string;
  status: ChannelStatus;
  plan: 'free' | 'pro' | 'network';
  revenueSplit: {
    platformPercentage: number;
    channelOwnerPercentage: number;
  };
  featured: boolean;
  liveNow: boolean;
  liveStreamUrl?: string;
  createdAt: any;
  updatedAt: any;
}

export type ContentStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived';

export interface Show {
  id: string;
  channelId: string;
  ownerId: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  rating: string;
  posterUrl: string;
  bannerUrl: string;
  status: ContentStatus;
  featured: boolean;
  createdAt: any;
  updatedAt: any;
}

export type VideoProvider = 'external' | 'vimeo' | 'youtube' | 'hls' | 'mp4' | 'cloudflare_stream' | 'mux' | 'bunny_stream';

export interface Episode {
  id: string;
  showId: string;
  channelId: string;
  ownerId: string;
  title: string;
  slug: string;
  description: string;
  videoProvider: VideoProvider;
  videoUrl: string;
  videoId?: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  seasonNumber: number;
  episodeNumber: number;
  status: ContentStatus;
  monetizationEnabled: boolean;
  createdAt: any;
  updatedAt: any;
}

export type ProgramType = 'episode' | 'live' | 'news' | 'sports' | 'ad' | 'special_event' | 'block';

export interface Schedule {
  id: string;
  channelId: string;
  ownerId: string; // email for owner/admin seeded data
  programType: ProgramType;
  contentId?: string; // ID of episode, show, or ad (optional for generic blocks)
  title: string;
  description: string;
  startTime: any;
  endTime: any;
  timezone: string;
  status: 'approved' | 'cancelled' | 'archived';
  createdAt: any;
  updatedAt: any;
}

export type AdStatus = 'draft' | 'pending_review' | 'approved' | 'active' | 'paused' | 'completed' | 'rejected';

export interface Ad {
  id: string;
  advertiserName: string;
  channelId: string;
  ownerId: string;
  title: string;
  type: 'video' | 'banner' | 'overlay';
  mediaUrl: string;
  targetUrl: string;
  budget: number;
  startDate: any;
  endDate: any;
  status: AdStatus;
  impressions: number;
  clicks: number;
  revenueSplit: {
    platformPercentage: number;
    channelOwnerPercentage: number;
  };
  createdAt: any;
  updatedAt: any;
}

export interface RevenueRecord {
  id: string;
  channelId: string;
  ownerId: string;
  source: 'ad' | 'subscription' | 'sponsorship';
  sourceId: string;
  grossAmount: number;
  platformShare: number;
  channelOwnerShare: number;
  status: 'pending' | 'cleared' | 'paid';
  periodStart: any;
  periodEnd: any;
  createdAt: any;
}

export type LiveEventStatus = 'draft' | 'scheduled' | 'live' | 'ended' | 'disabled';

export interface LiveEvent {
  id: string;
  channelId: string;
  ownerId: string;
  title: string;
  description: string;
  provider: 'cloudflare_stream';
  ingestUrl: string;
  streamKey: string;
  playbackUrl: string;
  playbackId: string;
  status: LiveEventStatus;
  scheduledStart: any;
  scheduledEnd: any;
  createdAt: any;
  updatedAt: any;
}

export type AdOrderStatus = 'pending' | 'paid' | 'active' | 'rejected' | 'completed' | 'refunded';

export interface AdOrder {
  id: string;
  advertiserName: string;
  email: string;
  packageType: 'basic' | 'featured' | 'sponsor';
  channelId?: string;
  amount: number;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  status: AdOrderStatus;
  createdAt: any;
  updatedAt: any;
}
