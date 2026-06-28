export function parseBilibiliUrl(url: string): string | null {
  const match = url.match(/bilibili\.com\/video\/(BV\w+)/);
  if (!match) return null;
  return `//player.bilibili.com/player.html?bvid=${match[1]}`;
}

export function BilibiliPlayer({ url }: { url: string }) {
  const embedUrl = parseBilibiliUrl(url);
  if (!embedUrl) return null;

  return (
    <iframe
      src={embedUrl}
      allow="fullscreen"
      referrerPolicy="no-referrer"
      style={{
        width: '100%',
        aspectRatio: '16 / 9',
        border: 'none',
        borderRadius: '8px',
      }}
    />
  );
}
