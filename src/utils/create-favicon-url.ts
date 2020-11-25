export function createFaviconUrl(url: string): string {
  const {hostname} = new URL(url);

  return `https://c.1password.com/richicons/images/login/120/${hostname}.png`;
}
