function useDirectUrl(src) {
  return (
    src.startsWith("http://home4strays.informatik.tha.de") ||
    src.startsWith("http://localhost:9000") ||
    src.startsWith("http://127.0.0.1:9000") ||
    src.startsWith("https://s3.home4strays.org")
  );
}

export default function customImageLoader({src, width, quality}) {
  if (useDirectUrl(src)) {
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
