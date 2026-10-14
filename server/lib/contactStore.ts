import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export interface ContactRecord {
  id: string;
  receivedAt: string;
  name: string;
  email: string;
  message: string;
  company?: string;
}

export interface ContactStore {
  append: (record: ContactRecord) => Promise<void>;
  readonly filePath: string;
}

export const CONTACT_FILE_NAME = "contact-submissions.jsonl";

/** Appends one JSON line per submission; writes are serialized so lines never interleave. */
export function createContactStore(dataDir: string): ContactStore {
  const filePath = path.join(dataDir, CONTACT_FILE_NAME);
  let queue: Promise<void> = Promise.resolve();

  function append(record: ContactRecord): Promise<void> {
    const line = `${JSON.stringify(record)}\n`;
    const write = queue.then(async () => {
      await mkdir(dataDir, { recursive: true });
      await appendFile(filePath, line, "utf8");
    });
    // Keep the chain alive even if this write fails; the caller still sees the rejection.
    queue = write.catch(() => undefined);
    return write;
  }

  return { append, filePath };
}
