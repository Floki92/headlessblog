export const CONFIG = {
  WP_URL: import.meta.env.VITE_WP_URL || 'https://example.com',
  USE_GRAPHQL: import.meta.env.VITE_USE_GRAPHQL === 'true',
  POSTS_PER_PAGE: parseInt(import.meta.env.VITE_POSTS_PER_PAGE) || 6
};