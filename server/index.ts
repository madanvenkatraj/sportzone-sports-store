/**
 * Standalone server: `npm start` serves the built site (dist/) and the /api routes together.
 * In development the same API runs inside the Vite dev server instead (see vite.config.ts).
 *
 * Environment:
 * - PORT         port to listen on (default 3000)
 * - DATA_DIR     where contact submissions are stored (default ./data)
 * - TRUST_PROXY  set to "1" when running behind one reverse proxy / load balancer, so rate
 *                limits key on each visitor's X-Forwarded-For address instead of the proxy's.
 *                Leave it unset when clients connect directly, so they cannot spoof that header.
 *                See server/lib/trustProxy.ts for the accepted values.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.ts";
import { parseTrustProxy } from "./lib/trustProxy.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT ?? 3000);
const dataDir = process.env.DATA_DIR ?? path.join(root, "data");
const trustProxy = parseTrustProxy(process.env.TRUST_PROXY);

const app = createApp({ dataDir, staticDir: path.join(root, "dist"), trustProxy });

app.listen(port, () => {
  console.log(
    `[api] listening on http://localhost:${port} (data: ${dataDir}, trust proxy: ${trustProxy ?? "off"})`,
  );
});
