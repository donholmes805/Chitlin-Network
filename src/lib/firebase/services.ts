import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from './config';
import { Show, Episode, Channel, Schedule, RevenueRecord } from '@/types';

// Standardized collection references
export const COLLECTIONS = {
  USERS: 'users',
  CHANNELS: 'channels',
  SHOWS: 'shows',
  EPISODES: 'episodes',
  SCHEDULES: 'schedules',
  ADS: 'ads',
  REVENUE_LEDGER: 'revenueLedger',
  PLATFORM_SETTINGS: 'platformSettings',
  AD_ORDERS: 'adOrders',
  LIVE_EVENTS: 'liveEvents',
};

// Generic Service functions
export const firebaseService = {
  // --- Channels ---
  async getChannel(channelId: string) {
    const docRef = doc(db, COLLECTIONS.CHANNELS, channelId);
    const snap = await getDoc(docRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } as Channel : null;
  },

  async getApprovedChannels() {
    const q = query(
      collection(db, COLLECTIONS.CHANNELS), 
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })) as Channel[];
  },

  // --- Shows ---
  async getShowsByChannel(channelId: string) {
    const q = query(
      collection(db, COLLECTIONS.SHOWS), 
      where('channelId', '==', channelId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })) as Show[];
  },

  async createShow(showData: Omit<Show, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, COLLECTIONS.SHOWS), {
      ...showData,
      status: 'pending_review',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // --- Schedule ---
  async getCurrentSchedule(channelId: string) {
    const now = Timestamp.now();
    const q = query(
      collection(db, COLLECTIONS.SCHEDULES),
      where('channelId', '==', channelId),
      where('startTime', '<=', now),
      orderBy('startTime', 'desc'),
      limit(1)
    );
    const snap = await getDocs(q);
    return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() } as Schedule;
  },

  // --- Revenue ---
  async getRevenueLedger(ownerId?: string) {
    let q = collection(db, COLLECTIONS.REVENUE_LEDGER) as any;
    if (ownerId) {
      q = query(q, where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'));
    } else {
      q = query(q, orderBy('createdAt', 'desc'));
    }
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })) as RevenueRecord[];
  }
};
