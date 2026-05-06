/**
 * Chitlin Network TV - Centralized Pricing Configuration
 * This file maps Stripe Price IDs (from environment variables) to the application tiers.
 */

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  stripePriceId: string | undefined;
}

export const VIEWER_MEMBERSHIPS: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic Access',
    price: '$1.99',
    period: '/mo',
    description: 'Ad-supported, high-quality streaming for the casual viewer.',
    features: ['14-day free trial', 'Access to all 150+ channels', 'Standard HD video quality', 'Basic community chat'],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_VIEWER_BASIC_PRICE_ID,
  },
  {
    id: 'premium',
    name: 'Premium Plus',
    price: '$8.99',
    period: '/mo',
    description: 'The ultimate viewing experience with no interruptions.',
    features: ['14-day free trial', 'Zero commercial ads', 'Ultra-HD 4K streaming', 'Early access to Originals'],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_VIEWER_PREMIUM_PRICE_ID,
  },
  {
    id: 'family',
    name: 'Family Bundle',
    price: '$14.99',
    period: '/mo',
    description: 'One plan for the whole household. Multiple streams.',
    features: ['14-day free trial', 'Up to 5 simultaneous streams', 'Parental control settings', 'All Premium Plus benefits'],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_VIEWER_FAMILY_PRICE_ID,
  }
];

export const CHANNEL_PLANS = [
  {
    id: 'starter',
    name: 'Starter Channel',
    adminFee: '$500',
    monthlyFee: '$99',
    description: 'Ideal for independent creators starting their journey.',
    features: ['1 Linear Channel', '100GB Storage', 'Basic Analytics', 'Community Support'],
    adminPriceId: process.env.NEXT_PUBLIC_STRIPE_CHANNEL_STARTER_ADMIN_FEE_PRICE_ID,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_CHANNEL_STARTER_MONTHLY_PRICE_ID,
  },
  {
    id: 'growth',
    name: 'Growth Channel',
    adminFee: '$750',
    monthlyFee: '$249',
    description: 'For established brands scaling their reach.',
    features: ['3 Linear Channels', '500GB Storage', 'Advanced Analytics', 'Priority Support'],
    adminPriceId: process.env.NEXT_PUBLIC_STRIPE_CHANNEL_GROWTH_ADMIN_FEE_PRICE_ID,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_CHANNEL_GROWTH_MONTHLY_PRICE_ID,
  },
  {
    id: 'partner',
    name: 'Network Partner',
    adminFee: '$1,000',
    monthlyFee: '$399',
    description: 'The ultimate tier for major media groups.',
    features: ['Unlimited Channels', '2TB Storage', 'Full Analytics Suite', 'Dedicated Account Manager'],
    adminPriceId: process.env.NEXT_PUBLIC_STRIPE_CHANNEL_PARTNER_ADMIN_FEE_PRICE_ID,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_CHANNEL_PARTNER_MONTHLY_PRICE_ID,
  }
];

export const AD_PACKAGES: PricingTier[] = [
  {
    id: 'basic_ad',
    name: 'Basic Ad Placement',
    price: '$99',
    period: 'one-time',
    description: 'Standard 30-second spot in rotating network slots.',
    features: ['Rotating slot placement', 'Standard analytics report', '7-day duration'],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_AD_BASIC_PRICE_ID,
  },
  {
    id: 'featured_ad',
    name: 'Featured Ad Placement',
    price: '$249',
    period: 'one-time',
    description: 'High-visibility placement during peak hours.',
    features: ['Prime time placement', 'Enhanced analytics report', '14-day duration'],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_AD_FEATURED_PRICE_ID,
  },
  {
    id: 'sponsor_block',
    name: 'Sponsored Show Block',
    price: '$499',
    period: 'one-time',
    description: 'Exclusive sponsorship of a specific show block.',
    features: ['Exclusivity during block', 'Direct show association', 'Custom intro/outro', '30-day duration'],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_AD_SPONSORED_PRICE_ID,
  }
];

export const PRICING_CONFIG = {
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  IS_LIVE: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_') || false,
};
