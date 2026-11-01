/**
 * Bundle entry. The implementation lives in `impl.js` and is imported with a
 * file-mtime revision query so a plain bundle toggle re-loads fresh host code
 * without restarting the DSH process (Node caches plain ESM imports by URL).
 *
 * Keep this file tiny: it is the only host module the Cordis Loader caches.
 */
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const name = 'dsh-madedown';
export const inject = ['tools', 'webServer', 'systemPrompt'];

/**
 * Load the current implementation and run it on this plugin context.
 * @param ctx - host Cordis context owned by this fiber.
 * @returns the implementation's apply result.
 */
export async function apply(ctx) {
  const url = new URL('./impl.js', import.meta.url);
  let revision;
  try {
    revision = Math.trunc(statSync(fileURLToPath(url)).mtimeMs);
  } catch {
    revision = Date.now();
  }
  const implementation = await import(`${url.href}?v=${revision}`);
  return implementation.apply(ctx);
}
