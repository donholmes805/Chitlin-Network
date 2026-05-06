import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './services';
import { 
  Channel, 
  Show, 
  Episode, 
  Schedule, 
  Ad, 
  AdOrder, 
  RevenueRecord, 
  LiveEvent 
} from '@/types';

/**
 * Reusable Firestore analytics and data aggregation service.
 */
export const analyticsService = {
  // --- Admin Stats ---
  
  async getAdminStats() {
    const [
      channelsSnap, 
      showsSnap, 
      episodesSnap, 
      schedulesSnap, 
      adsSnap, 
      ordersSnap, 
      ledgerSnap,
      liveEventsSnap
    ] = await Promise.all([
      getDocs(collection(db, COLLECTIONS.CHANNELS)),
      getDocs(collection(db, COLLECTIONS.SHOWS)),
      getDocs(collection(db, COLLECTIONS.EPISODES)),
      getDocs(collection(db, COLLECTIONS.SCHEDULES)),
      getDocs(collection(db, COLLECTIONS.ADS)),
      getDocs(collection(db, COLLECTIONS.REVENUE_LEDGER)),
      getDocs(collection(db, 'adOrders')), // adOrders is not in COLLECTIONS yet
      getDocs(collection(db, 'liveEvents'))
    ]);

    const channels = channelsSnap.docs.map(d => d.data() as Channel);
    const shows = showsSnap.docs.map(d => d.data() as Show);
    const episodes = episodesSnap.docs.map(d => d.data() as Episode);
    const ads = adsSnap.docs.map(d => d.data() as Ad);
    const orders = ordersSnap.docs.map(d => d.data() as AdOrder);
    const ledger = ledgerSnap.docs.map(d => d.data() as RevenueRecord);

    const revenueTotals = ledger.reduce((acc, r) => {
      acc.gross += r.grossAmount || 0;
      acc.platform += r.platformShare || 0;
      acc.owner += r.channelOwnerShare || 0;
      return acc;
    }, { gross: 0, platform: 0, owner: 0 });

    return {
      channels: {
        total: channels.length,
        approved: channels.filter(c => c.status === 'approved').length,
        pending: channels.filter(c => c.status === 'pending_review').length,
        suspended: channels.filter(c => c.status === 'suspended').length,
      },
      shows: {
        total: shows.length,
        approved: shows.filter(s => s.status === 'approved').length,
        pending: shows.filter(s => s.status === 'pending_review').length,
      },
      episodes: {
        total: episodes.length,
        approved: episodes.filter(e => e.status === 'approved').length,
        pending: episodes.filter(e => e.status === 'pending_review').length,
      },
      ads: {
        total: ads.length,
        active: ads.filter(a => a.status === 'active').length,
        pending: ads.filter(a => a.status === 'pending_review').length,
      },
      orders: {
        total: orders.length,
        paid: orders.filter(o => o.status === 'paid' || o.status === 'active').length,
      },
      revenue: revenueTotals,
      liveEvents: {
        active: liveEventsSnap.size
      }
    };
  },

  // --- Owner/Channel Stats ---

  async getOwnerStats(ownerEmail: string) {
    // 1. Get owner's channels
    const channelsQ = query(collection(db, COLLECTIONS.CHANNELS), where('ownerId', '==', ownerEmail));
    const channelsSnap = await getDocs(channelsQ);
    const channels = channelsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Channel));

    if (channels.length === 0) return null;

    const channelIds = channels.map(c => c.id);

    // 2. Fetch all related data for these channels
    // Firestore 'in' query limit is 10. If someone has 10+ channels, we might need a different approach.
    // For MVP, we'll handle up to 10.
    const limitedChannelIds = channelIds.slice(0, 10);

    const [showsSnap, episodesSnap, schedulesSnap, adsSnap, ledgerSnap, liveEventsSnap] = await Promise.all([
      getDocs(query(collection(db, COLLECTIONS.SHOWS), where('channelId', 'in', limitedChannelIds))),
      getDocs(query(collection(db, COLLECTIONS.EPISODES), where('channelId', 'in', limitedChannelIds))),
      getDocs(query(collection(db, COLLECTIONS.SCHEDULES), where('channelId', 'in', limitedChannelIds))),
      getDocs(query(collection(db, COLLECTIONS.ADS), where('channelId', 'in', limitedChannelIds))),
      getDocs(query(collection(db, COLLECTIONS.REVENUE_LEDGER), where('channelId', 'in', limitedChannelIds))),
      getDocs(query(collection(db, 'liveEvents'), where('channelId', 'in', limitedChannelIds)))
    ]);

    const shows = showsSnap.docs.map(d => d.data() as Show);
    const episodes = episodesSnap.docs.map(d => d.data() as Episode);
    const ledger = ledgerSnap.docs.map(d => d.data() as RevenueRecord);

    const revenueTotals = ledger.reduce((acc, r) => {
      acc.gross += r.grossAmount || 0;
      acc.channelShare += r.channelOwnerShare || 0;
      return acc;
    }, { gross: 0, channelShare: 0 });

    return {
      channels,
      showsCount: shows.length,
      episodesCount: episodes.length,
      approvedCount: shows.filter(s => s.status === 'approved').length + episodes.filter(e => e.status === 'approved').length,
      pendingCount: shows.filter(s => s.status === 'pending_review').length + episodes.filter(e => e.status === 'pending_review').length,
      activeSchedules: schedulesSnap.docs.filter(d => (d.data() as Schedule).status === 'approved').length,
      activeAds: adsSnap.docs.filter(d => (d.data() as Ad).status === 'active').length,
      liveEvents: liveEventsSnap.size,
      revenue: revenueTotals
    };
  },

  async getRecentActivity(limitCount = 10) {
    // This could be a specialized activity log collection or just recent shows/episodes/orders
    const [showsSnap, episodesSnap, ordersSnap] = await Promise.all([
      getDocs(query(collection(db, COLLECTIONS.SHOWS), orderBy('createdAt', 'desc'), limit(limitCount))),
      getDocs(query(collection(db, COLLECTIONS.EPISODES), orderBy('createdAt', 'desc'), limit(limitCount))),
      getDocs(query(collection(db, 'adOrders'), orderBy('createdAt', 'desc'), limit(limitCount)))
    ]);

    const activity = [
      ...showsSnap.docs.map(d => ({ type: 'show', id: d.id, ...d.data(), date: (d.data() as any).createdAt })),
      ...episodesSnap.docs.map(d => ({ type: 'episode', id: d.id, ...d.data(), date: (d.data() as any).createdAt })),
      ...ordersSnap.docs.map(d => ({ type: 'adOrder', id: d.id, ...d.data(), date: (d.data() as any).createdAt }))
    ].sort((a, b) => {
      const dateA = a.date?.toDate?.() || new Date(0);
      const dateB = b.date?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    return activity.slice(0, limitCount);
  }
};
