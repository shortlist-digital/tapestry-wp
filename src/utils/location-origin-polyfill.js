export default function locationOriginPolyfill() {
  if (typeof window === 'undefined') {
    return;
  }

  // http://tosbourn.com/a-fix-for-window-location-origin-in-internet-explorer/
  if (!window.location.origin) {
    let loc = window.location,
      port = loc.port ? `:${loc.port}` : '';

    loc.origin = `${loc.protocol}//${loc.hostname}${port}`;
  }
}
