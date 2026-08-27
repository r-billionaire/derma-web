/**
 * Site Visual Identity
 *
 * This file is the single source of truth for the client's brand identity.
 * Swapping this config is how the site is adapted for a second client.
 */

export const theme = {
  colors: {
    background: '#F7F5F2',      // Warm off-white
    foreground: '#1F2420',     // Near-black with green undertone
    accentPrimary: '#2F4B3C',   // Deep forest green
    accentSecondary: '#C9A66B', // Warm muted gold
    neutral: '#8B8478',        // Supporting neutral
  },
  fonts: {
    display: 'Fraunces',        // Serif, for headlines
    body: 'Public Sans',       // Sans, for legibility
    data: 'IBM Plex Mono',     // Mono, for facts/credentials
  },
  assets: {
    logo: '/logo.png',
  },
};

export type Theme = typeof theme;
