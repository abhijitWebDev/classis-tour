/**
 * Photography helper.
 *
 * Primary source is Unsplash's CDN. `<Photo>` falls back to a stable seeded
 * source if a given asset ever 404s, so a page never renders a broken frame.
 */
export function photo(id: string, w = 1600, h?: number) {
  const size = h ? `&w=${w}&h=${h}` : `&w=${w}`;
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80${size}`;
}

export function fallbackPhoto(seed: string, w = 1600, h = 1000) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}
