export default function customImageLoader({src, width, quality}) {
  if (src.startsWith("http://home4strays.informatik.tha.de")) {
    return src;
  }

  const params = new URLSearchParams();
  params.set("url", src);
  params.set("w", width.toString());
  if (quality) {
    params.set("q", quality.toString());
  }

  return `/_next/image?${params.toString()}`;
}
