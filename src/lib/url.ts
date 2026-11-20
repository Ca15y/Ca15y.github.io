/**
 * Resolve a site-relative path against the configured base path, so links keep
 * working if BASE_PATH in site.config.mjs ever changes.
 *
 *   url('projects/')  -> '/projects/'
 *   url('#labs')      -> '/#labs'   (home-page anchor, valid from any page)
 */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return base + path.replace(/^\//, '');
}
