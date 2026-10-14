/**
 * Reads the TRUST_PROXY environment value into Express's "trust proxy" setting.
 *
 * Rate limits key on `req.ip`. Express only derives `req.ip` from X-Forwarded-For when
 * "trust proxy" is enabled, so:
 * - unset / "" / "false": off (default). `req.ip` is the socket address, and a client
 *   cannot dodge a limit by sending its own X-Forwarded-For header. Behind a reverse proxy,
 *   though, every visitor then shares the proxy's single bucket.
 * - "1", "2", …: trust that many proxy hops (use "1" behind one load balancer or proxy).
 * - "true": trust every hop. Only safe when the app is unreachable except through a proxy.
 * - anything else (e.g. "loopback, 10.0.0.0/8"): passed to Express as a subnet/preset list.
 */
export function parseTrustProxy(value: string | undefined): boolean | number | string | undefined {
  const raw = value?.trim() ?? "";
  if (raw === "" || raw.toLowerCase() === "false") return undefined;
  if (raw.toLowerCase() === "true") return true;
  if (/^\d+$/.test(raw)) return Number(raw);
  return raw;
}
