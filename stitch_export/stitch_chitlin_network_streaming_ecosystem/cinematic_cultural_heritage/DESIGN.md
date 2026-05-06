---
name: Cinematic Cultural Heritage
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#ffb4a8'
  on-secondary: '#690000'
  secondary-container: '#920703'
  on-secondary-container: '#ff9a8a'
  tertiary: '#d2d1a6'
  on-tertiary: '#323214'
  tertiary-container: '#b6b58c'
  on-tertiary-container: '#474727'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a8'
  on-secondary-fixed: '#410000'
  on-secondary-fixed-variant: '#920703'
  tertiary-fixed: '#e6e5b9'
  tertiary-fixed-dim: '#cac99f'
  on-tertiary-fixed: '#1d1d03'
  on-tertiary-fixed-variant: '#484828'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Epilogue
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Epilogue
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  safe-area-tv: 80px
---

## Brand & Style

This design system establishes a premier digital destination for Black-owned media, merging the high-production value of modern streaming giants with a distinct cultural soul. The aesthetic is **Cinematic Modernism**, characterized by deep, expansive backgrounds that allow content to take center stage, accented by prestigious tones that evoke a sense of "Black Excellence."

The UI leans into **Glassmorphism** for navigational overlays and metadata containers, creating a sense of physical depth as if the interface is projected onto the content. It is professional and trustworthy, utilizing high-contrast focus states to ensure a seamless "10-foot UI" experience optimized for TV remote navigation while maintaining the precision required for mobile and desktop dashboards.

The emotional response should be one of pride and immersion—a "front-row seat" experience that feels both exclusive and community-driven.

## Colors

The palette is anchored in a **Dark Cinematic** foundation, using a rich, near-black charcoal (#0A0A0A) for the primary canvas to minimize eye strain and maximize the "pop" of video thumbnails. 

- **Warm Gold (#D4AF37)**: Used for high-priority calls to action, active states, and premium "Plus" branding elements. It signifies quality and prestige.
- **Deep Red (#8B0000)**: Reserved for "LIVE" indicators, breaking news badges, and destructive actions. It provides a classic broadcast feel without being jarring.
- **Subtle Cream (#FFFDD0)**: Replaces pure white for all primary text to enhance readability against dark backgrounds, providing a sophisticated, editorial warmth.
- **Surface Overlays**: Use semi-transparent blacks with a 60-80% opacity and a high blur factor (20px+) to maintain legibility over vibrant media.

## Typography

This design system utilizes a dual-font strategy to balance editorial character with technical performance. 

**Epilogue** is used for headlines and display text. Its geometric yet expressive nature provides a bold, contemporary voice that feels intentional and high-end. Use tight tracking on larger display sizes to mimic cinematic title cards.

**Inter** is the workhorse for body copy, metadata, and interface labels. It ensures maximum legibility across all screen sizes, particularly on TV displays where sub-pixel rendering can vary. Cream-colored text on the dark background should utilize a slightly higher line-height (1.6) to prevent "haloing" and ensure a comfortable reading experience during long browsing sessions.

## Layout & Spacing

The layout follows a **Fluid Grid** model with strict adherence to an 8px rhythmic scale. 

On TV and Desktop, the layout uses a 12-column grid. For the "10-foot experience," vertical scrolling is minimized in favor of horizontal "shelves" or "carousels" that allow the user to browse categories (e.g., "Trending Now," "Originals"). 

Margins are generous to create a premium, uncrowded feel. A "Safe Area" of 80px is maintained for TV interfaces to account for overscan on older hardware. Components like media cards use a 24px gutter to provide clear visual separation, ensuring the gold focus border has room to breathe without overlapping adjacent content.

## Elevation & Depth

Visual hierarchy is managed through **Glassmorphism** and tonal stacking rather than traditional drop shadows.

- **Level 0 (Base)**: The rich charcoal background (#0A0A0A).
- **Level 1 (Surface)**: Cards and containers use a slightly lighter charcoal (#1A1A1A) with a subtle 1px inner border (10% Cream) to define edges.
- **Level 2 (Overlays)**: Navigation bars, sidebars, and detail modals use a backdrop filter (`blur(24px)`) combined with a 70% opaque neutral black fill. This allows the colors of the underlying media to bleed through subtly, maintaining a cinematic atmosphere.
- **Focus State**: To accommodate TV remote navigation, the focused element must exhibit a 3px solid Gold (#D4AF37) border and a slight scale increase (1.05x). This is the only instance where a soft outer glow (Gold, 20% opacity) is permitted to signify "glow" from a screen.

## Shapes

The design system employs a **Rounded** aesthetic to soften the "tech" feel and make the platform feel more approachable and community-focused. 

Media thumbnails and "Large Media Cards" use a 12px radius (`rounded-lg`) to create a modern, tablet-like look even on large screens. Buttons and smaller UI elements like input fields follow a 8px radius (`rounded-md`). Interactive chips for categories use a fully rounded "pill" shape to distinguish them from actionable media cards.

## Components

### Buttons & Interaction
- **Primary CTA**: Solid Gold (#D4AF37) with black text for maximum contrast. 
- **Secondary CTA**: Ghost style with a 2px Cream (#FFFDD0) border and Cream text.
- **Focus State**: Every interactive element must have a clear "focused" variant using the Gold border and scale-up effect.

### Media Cards
- **Poster Ratio (2:3)**: For movies and series. Features a gradient overlay at the bottom for title legibility.
- **Landscape Ratio (16:9)**: For LIVE channels and "Continue Watching" shelves. Includes a progress bar at the bottom using the Deep Red (#8B0000) to indicate completion status.

### Indicators & Badges
- **Live Indicator**: A small Deep Red pill with a pulsing animation and "LIVE" in all-caps bold Inter.
- **Premium Tag**: A Gold-bordered badge with a subtle gradient to indicate "Plus" or "Exclusive" content.

### Inputs & Dashboards
- **Search**: A glassmorphic input field that expands on focus.
- **Dashboard Cards**: For user profiles and settings, use a clean 1px border (#FFFFFF 10%) with no background fill to maintain a minimal, organized look against the dark canvas.