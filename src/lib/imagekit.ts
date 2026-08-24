const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/rbillionaire';
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 'public_mBQJBvh2bjNPEzzO+slDpSY2TcM=';

export const imagekit = {
  publicKey,
  urlEndpoint,
};

/**
 * Generates an optimized ImageKit URL.
 * Transformations go in one comma-separated `tr:` segment - `tr:w-80,h-80`.
 * @param path Path to the image in ImageKit
 * @param options Transformation options (width, height, quality)
 */
export function getOptimizedImage(path: string, options: { width?: number; height?: number; quality?: number } = {}) {
  const { width, height, quality } = options;

  const transformation = [
    width && `w-${width}`,
    height && `h-${height}`,
    quality && `q-${quality}`,
  ]
    .filter(Boolean)
    .join(',');

  return [urlEndpoint.replace(/\/$/, ''), transformation && `tr:${transformation}`, path.replace(/^\//, '')]
    .filter(Boolean)
    .join('/');
}
