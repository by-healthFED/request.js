export function isAbsoluteUrl(url) {
  return /^[a-z][a-z0-9+.-]*:/.test(url);
}
