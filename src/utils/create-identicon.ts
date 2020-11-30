import Identicon from 'identicon.js';
import {createHash} from './create-hash';

export async function createIdenticon(
  url: string,
  size: number
): Promise<string> {
  const identicon = new Identicon(await createHash(new URL(url).hostname), {
    size,
    format: 'svg',
  });

  return `data:image/svg+xml;base64,${identicon.toString()}`;
}
