import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function extractPublicId(url: string): string | null {
  const marker = `/upload/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;

  // Strip optional version segment (v1234567890/)
  let rest = url.slice(idx + marker.length);
  rest = rest.replace(/^v\d+\//, '');

  // Strip file extension
  const dotIdx = rest.lastIndexOf('.');
  return dotIdx !== -1 ? rest.slice(0, dotIdx) : rest;
}

export { cloudinary };