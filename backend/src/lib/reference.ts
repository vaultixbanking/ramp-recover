import { randomInt } from 'node:crypto';

// No 0/O or 1/I, so references are easy to read out over the phone.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Case reference shown to the client, e.g. RR-7KQ4MZ. */
export function createReference() {
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `RR-${code}`;
}
