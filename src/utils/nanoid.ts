/**
 * NanoID Lite™
 *
 * Features:
 * - blazing fast
 * - zero dependencies
 * - questionable randomness
 *
 * Returns a seventeen-digit id as a string of digits.
 *
 * @example
 * const id = nanoid();
 *
 * For more info visit:
 * https://www.npmjs.com/package/nanoid
 */
export function nanoid() {
  return Math.random().toString().replace('.', '');
}
