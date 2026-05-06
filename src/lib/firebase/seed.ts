import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from './config';
import type { Ad, Channel, Episode, RevenueRecord, Show } from '@/types';

const OWNER_EMAIL = 'donholmes805@gmail.com';
const TZ = 'America/Los_Angeles';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function getOrCreateBySlug<T extends { slug: string }>(
  collectionName: string,
  slug: string,
  create: (id: string) => Omit<T, 'id' | 'createdAt' | 'updatedAt'> & { id: string }
) {
  const q = query(collection(db, collectionName), where('slug', '==', slug));
  const snap = await getDocs(q);
  if (!snap.empty) {
    const existing = snap.docs[0];
    return { id: existing.id, ...(existing.data() as any) } as T & { id: string };
  }

  const ref = doc(collection(db, collectionName));
  const data = create(ref.id);
  await setDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return data as T & { id: string };
}

export async function seedPlatformData() {
  console.log("Starting Chitlin' Network Genesis Seed...");

  const channelsData = [
    {
      slug: 'chitlin-live',
      name: "Chitlin' Network Live",
      category: 'Flagship',
      description:
        "The main live channel for Chitlin' Network, featuring original programming, cultural conversations, live specials, music, news, sports, and independent entertainment.",
      logoUrl:
        'https://images.unsplash.com/photo-1594908900066-3f47337549d8?auto=format&fit=crop&q=80&w=200&h=200',
      bannerUrl:
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200&h=400',
      liveStreamUrl: '',
    },
    {
      slug: 'chitlin-newsroom',
      name: "Chitlin' Newsroom",
      category: 'News',
      description: 'Community-centered news, commentary, local updates, interviews, and cultural reporting.',
      logoUrl:
        'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=200&h=200',
      bannerUrl:
        'https://images.unsplash.com/photo-1476242906366-d8eb64c2f661?auto=format&fit=crop&q=80&w=1200&h=400',
      liveStreamUrl: '',
    },
    {
      slug: 'chitlin-sports',
      name: "Chitlin' Sports Desk",
      category: 'Sports',
      description: 'Sports talk, local athletics, independent sports coverage, game-day culture, and commentary.',
      logoUrl:
        'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=200&h=200',
      bannerUrl:
        'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1200&h=400',
      liveStreamUrl: '',
    },
    {
      slug: 'soul-stage',
      name: 'Soul Stage',
      category: 'Music',
      description: 'Live performances, Southern soul, blues, independent artists, interviews, and music culture.',
      logoUrl:
        'https://images.unsplash.com/photo-1514525253361-bee8a187499b?auto=format&fit=crop&q=80&w=200&h=200',
      bannerUrl:
        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1200&h=400',
      liveStreamUrl: '',
    },
    {
      slug: 'indie-film',
      name: 'Indie Film House',
      category: 'Movies',
      description: 'Independent films, documentaries, shorts, filmmaker interviews, and original visual storytelling.',
      logoUrl:
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=200&h=200',
      bannerUrl:
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1200&h=400',
      liveStreamUrl: '',
    },
    {
      slug: 'comedy-porch',
      name: 'Comedy Porch',
      category: 'Comedy',
      description: 'Stand-up specials, sketch comedy, interviews, late-night laughs, and independent comedy programming.',
      logoUrl:
        'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&q=80&w=200&h=200',
      bannerUrl:
        'https://images.unsplash.com/photo-1515165562835-c4c6b0b0b11f?auto=format&fit=crop&q=80&w=1200&h=400',
      liveStreamUrl: '',
    },
    {
      slug: 'gospel-sunday',
      name: 'Gospel Sunday',
      category: 'Faith',
      description: 'Gospel music, faith-centered programming, Sunday specials, positive messages, and community conversations.',
      logoUrl:
        'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&q=80&w=200&h=200',
      bannerUrl:
        'https://images.unsplash.com/photo-1519682577862-22b62b24e493?auto=format&fit=crop&q=80&w=1200&h=400',
      liveStreamUrl: '',
    },
    {
      slug: 'street-food-stories',
      name: 'Street Food Stories',
      category: 'Lifestyle',
      description: 'Food culture, small restaurants, street vendors, family recipes, and community cooking stories.',
      logoUrl:
        'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&q=80&w=200&h=200',
      bannerUrl:
        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1200&h=400',
      liveStreamUrl: '',
    },
  ];

  const channels: Channel[] = [];
  for (const c of channelsData) {
    const channel = await getOrCreateBySlug<Channel>('channels', c.slug, (id) => ({
      id,
      ownerId: OWNER_EMAIL,
      status: 'approved',
      plan: 'network',
      revenueSplit: { platformPercentage: 40, channelOwnerPercentage: 60 },
      featured: true,
      liveNow: c.slug === 'chitlin-live',
      posterUrl: c.bannerUrl,
      ...c,
    }));
    channels.push(channel);
    await seedShows(channel.id, channel.category);
  }

  await seedAds(channels);
  await seedRevenueLedger(channels);
  await seedWeeklySchedules(channels);

  console.log('Genesis Seed Complete.');
}

async function seedShows(channelId: string, category: string) {
  const showTitles: Record<string, string[]> = {
    Flagship: ['The Front Porch Report', "Chitlin' Prime", 'Culture Live Tonight'],
    News: ['Local Voices', 'The Community Brief', 'Street-Level News'],
    Sports: ['Game Day Culture', 'Courtside & Sidelines', 'The Final Whistle'],
    Music: ['Southern Soul Sessions', 'Behind the Mic', 'Blues After Dark'],
    Movies: ['Independent Lens', 'Short Film Showcase', "Director's Chair"],
    Comedy: ['Laughs After Dark', 'Porch Talk Comedy', 'Open Mic Hour'],
    Faith: ['The Sunday Table', 'Gospel Morning Live', 'Songs of the Spirit'],
    Lifestyle: ['Plate by Plate', 'The Sunday Table', 'Kitchen Stories'],
  };

  const titles = showTitles[category] ?? ['New Originals'];

  for (const title of titles) {
    const slug = `${slugify(title)}-${channelId.slice(0, 6)}`;
    const show = await getOrCreateBySlug<Show>('shows', slug, (id) => ({
      id,
      channelId,
      ownerId: OWNER_EMAIL,
      title,
      slug,
      description: `A premiere series from ${category} exploring the heart of the community.`,
      category,
      rating: 'TV-PG',
      posterUrl:
        'https://images.unsplash.com/photo-1598897066217-45279f43f111?auto=format&fit=crop&q=80&w=400&h=600',
      bannerUrl:
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200&h=400',
      status: 'approved',
      featured: true,
    }));

    await seedEpisodes(show.id, channelId, title);
  }
}

async function seedEpisodes(showId: string, channelId: string, showTitle: string) {
  for (let episodeNumber = 1; episodeNumber <= 2; episodeNumber++) {
    const title = `${showTitle}: Episode ${episodeNumber}`;
    const slug = `${slugify(showTitle)}-s1e${episodeNumber}-${showId.slice(0, 6)}`;

    const q = query(collection(db, 'episodes'), where('slug', '==', slug));
    const snap = await getDocs(q);
    if (!snap.empty) continue;

    const ref = doc(collection(db, 'episodes'));
    await setDoc(ref, {
      id: ref.id,
      showId,
      channelId,
      ownerId: OWNER_EMAIL,
      title,
      slug,
      description: `In this episode of ${showTitle}, we dive deep into the latest cultural movements and community stories.`,
      videoProvider: 'external',
      videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1598897066217-45279f43f111?auto=format&fit=crop&q=80&w=800&h=450',
      duration: 1800,
      seasonNumber: 1,
      episodeNumber,
      status: 'approved',
      monetizationEnabled: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

async function seedAds(channels: Channel[]) {
  const now = new Date();
  const inDays = (d: number) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

  const ads: Array<Omit<Ad, 'id'>> = [
    {
      advertiserName: "Chitlin' Network Promo",
      channelId: channels[0]?.id ?? '',
      ownerId: OWNER_EMAIL,
      title: 'Pre-roll: Network Launch',
      type: 'video',
      mediaUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
      targetUrl: 'https://example.com',
      budget: 1000,
      startDate: Timestamp.fromDate(now),
      endDate: Timestamp.fromDate(inDays(14)),
      status: 'active',
      impressions: 0,
      clicks: 0,
      revenueSplit: { platformPercentage: 40, channelOwnerPercentage: 60 },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as any,
    {
      advertiserName: 'Community Sponsor',
      channelId: channels[1]?.id ?? '',
      ownerId: OWNER_EMAIL,
      title: 'Banner: Sponsored Block',
      type: 'banner',
      mediaUrl:
        'https://images.unsplash.com/photo-1520975958221-7b10f1e4bb73?auto=format&fit=crop&q=80&w=1200&h=400',
      targetUrl: 'https://example.com',
      budget: 500,
      startDate: Timestamp.fromDate(now),
      endDate: Timestamp.fromDate(inDays(30)),
      status: 'approved',
      impressions: 0,
      clicks: 0,
      revenueSplit: { platformPercentage: 40, channelOwnerPercentage: 60 },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as any,
    {
      advertiserName: 'Local Business',
      channelId: channels[2]?.id ?? '',
      ownerId: OWNER_EMAIL,
      title: 'Mid-roll: Local Spotlight',
      type: 'video',
      mediaUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
      targetUrl: 'https://example.com',
      budget: 750,
      startDate: Timestamp.fromDate(now),
      endDate: Timestamp.fromDate(inDays(21)),
      status: 'approved',
      impressions: 0,
      clicks: 0,
      revenueSplit: { platformPercentage: 40, channelOwnerPercentage: 60 },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as any,
    {
      advertiserName: 'Presented By',
      channelId: channels[0]?.id ?? '',
      ownerId: OWNER_EMAIL,
      title: 'Sponsored: Prime Time Block',
      type: 'overlay',
      mediaUrl:
        'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&q=80&w=1200&h=400',
      targetUrl: 'https://example.com',
      budget: 1500,
      startDate: Timestamp.fromDate(now),
      endDate: Timestamp.fromDate(inDays(60)),
      status: 'active',
      impressions: 0,
      clicks: 0,
      revenueSplit: { platformPercentage: 40, channelOwnerPercentage: 60 },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as any,
  ];

  for (const ad of ads) {
    if (!ad.channelId) continue;
    const slug = slugify(`${ad.title}-${ad.channelId}`);
    const q = query(collection(db, 'ads'), where('slug', '==', slug));
    const snap = await getDocs(q);
    if (!snap.empty) continue;
    const ref = doc(collection(db, 'ads'));
    await setDoc(ref, { id: ref.id, slug, ...ad, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }
}

async function seedRevenueLedger(channels: Channel[]) {
  for (const channel of channels) {
    const split = channel.revenueSplit ?? { platformPercentage: 40, channelOwnerPercentage: 60 };
    const grossAmount = 2500;
    const platformShare = Math.round((grossAmount * split.platformPercentage) / 100);
    const channelOwnerShare = grossAmount - platformShare;

    const slug = slugify(`launch-ledger-${channel.slug}`);
    const q = query(collection(db, 'revenueLedger'), where('slug', '==', slug));
    const snap = await getDocs(q);
    if (!snap.empty) continue;

    const ref = doc(collection(db, 'revenueLedger'));
    await setDoc(ref, {
      id: ref.id,
      slug,
      channelId: channel.id,
      ownerId: OWNER_EMAIL,
      source: 'sponsorship',
      sourceId: 'launch',
      grossAmount,
      platformShare,
      channelOwnerShare,
      status: 'cleared',
      periodStart: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
      periodEnd: Timestamp.fromDate(new Date()),
      createdAt: serverTimestamp(),
    } satisfies any);
  }
}

async function seedWeeklySchedules(channels: Channel[]) {
  const dayStart = new Date();
  dayStart.setHours(6, 0, 0, 0);

  // Preload episodes per channel to schedule
  const episodesByChannel: Record<string, Episode[]> = {};
  for (const channel of channels) {
    const q = query(collection(db, 'episodes'), where('channelId', '==', channel.id), where('status', '==', 'approved'));
    const snap = await getDocs(q);
    episodesByChannel[channel.id] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Episode[];
  }

  for (const channel of channels) {
    const episodes = episodesByChannel[channel.id] ?? [];
    if (episodes.length === 0) continue;

    for (let day = 0; day < 7; day++) {
      const start = new Date(dayStart.getTime() + day * 24 * 60 * 60 * 1000);
      const blocks = [
        { label: 'Morning', hours: 3 },
        { label: 'Midday', hours: 3 },
        { label: 'Evening', hours: 4 },
        { label: 'Late Night', hours: 2 },
      ];

      let cursor = new Date(start.getTime());
      let episodeCursor = 0;

      for (const block of blocks) {
        const blockEnd = new Date(cursor.getTime() + block.hours * 60 * 60 * 1000);

        // Hour-long episodes
        while (cursor.getTime() + 60 * 60 * 1000 <= blockEnd.getTime()) {
          const ep = episodes[episodeCursor % episodes.length]!;
          episodeCursor++;

          const startTime = new Date(cursor.getTime());
          const endTime = new Date(cursor.getTime() + 60 * 60 * 1000);
          cursor = new Date(endTime.getTime());

          const slug = slugify(`schedule-${channel.slug}-${startTime.toISOString()}`);
          const q = query(collection(db, 'schedules'), where('slug', '==', slug));
          const snap = await getDocs(q);
          if (!snap.empty) continue;

          const ref = doc(collection(db, 'schedules'));
          await setDoc(ref, {
            id: ref.id,
            slug,
            channelId: channel.id,
            ownerId: OWNER_EMAIL,
            programType: 'episode',
            contentId: ep.id,
            title: ep.title,
            description: `Scheduled broadcast: ${ep.title}.`,
            startTime: Timestamp.fromDate(startTime),
            endTime: Timestamp.fromDate(endTime),
            timezone: TZ,
            status: 'approved',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }

        // 30-minute sponsored block
        const adStart = new Date(cursor.getTime());
        const adEnd = new Date(adStart.getTime() + 30 * 60 * 1000);
        cursor = new Date(adEnd.getTime());

        const adSlug = slugify(`adblock-${channel.slug}-${adStart.toISOString()}`);
        const aq = query(collection(db, 'schedules'), where('slug', '==', adSlug));
        const asnap = await getDocs(aq);
        if (asnap.empty) {
          const ref = doc(collection(db, 'schedules'));
          await setDoc(ref, {
            id: ref.id,
            slug: adSlug,
            channelId: channel.id,
            ownerId: OWNER_EMAIL,
            programType: 'ad',
            title: 'Sponsored Block',
            description: 'Sponsored programming and community partners.',
            startTime: Timestamp.fromDate(adStart),
            endTime: Timestamp.fromDate(adEnd),
            timezone: TZ,
            status: 'approved',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }

        // Snap cursor to end of block
        cursor = new Date(blockEnd.getTime());
      }
    }
  }
}
