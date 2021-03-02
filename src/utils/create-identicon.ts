import Identicon from 'identicon.js';
import {createHash} from './create-hash';

export async function createIdenticon(url: string): Promise<string> {
  const identicon = new Identicon(await createHash(new URL(url).hostname), {
    size: 64,
    format: 'svg',
    background: [0, 0, 0, 0],
  });

  return `data:image/svg+xml;base64,${identicon.toString()}`;
}
