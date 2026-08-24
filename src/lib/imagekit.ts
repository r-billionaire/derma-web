import ImageKit from '@imagekit/javascript';

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/rbillionaire';
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 'public_mBQJBvh2bjNPEzzO+slDpSY2TcM=';

export const imagekit = new ImageKit({
  publicKey: publicKey,
  urlEndpoint: urlEndpoint,
});

/**
 * Generates an optimized ImageKit URL
 * @param path Path to the image in ImageKit
 * @param options Transformation options (width, height, quality, etc.)
 */
export function getOptimizedImage(path: string, options: { width?: number; height?: number; quality?: number } = {}) {
  const { width, height, quality = 80 } = options;
  let transformation = '';

  if (width) transformation += `tr:w-${width}`;
  if (height) transformation += `tr:h-${height}`;
  if (quality !== 80) transformation += `tr:q-${quality}`;

  const finalPath = transformation ? `${transformation}/${path}` : path;
  return `${urlEndpoint}/${finalPath}`;
}
