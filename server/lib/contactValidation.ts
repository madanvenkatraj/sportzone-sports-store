// Pure validation for contact submissions. No Node imports — the front end imports this too.

export interface ContactFieldError {
  field: string;
  message: string;
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
  company?: string;
  /** Honeypot: real visitors leave this empty. */
  website?: string;
}

export type ContactValidationResult =
  | { ok: true; value: ContactInput }
  | { ok: false; errors: ContactFieldError[] };

export const CONTACT_LIMITS = {
  nameMax: 100,
  emailMax: 254,
  messageMin: 10,
  messageMax: 2000,
  companyMax: 100,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(source: Record<string, unknown>, key: string): string | null {
  const raw = source[key];
  if (raw === undefined || raw === null) return "";
  if (typeof raw !== "string") return null;
  return raw.trim();
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

export function validateContact(input: unknown): ContactValidationResult {
  if (!isRecord(input)) {
    return { ok: false, errors: [{ field: "body", message: "Please send the form fields as a JSON object." }] };
  }

  const errors: ContactFieldError[] = [];
  const name = readString(input, "name");
  const email = readString(input, "email");
  const message = readString(input, "message");
  const company = readString(input, "company");
  const website = readString(input, "website");

  if (name === null || name.length === 0) {
    errors.push({ field: "name", message: "Please enter your name." });
  } else if (name.length > CONTACT_LIMITS.nameMax) {
    errors.push({ field: "name", message: `Name must be ${CONTACT_LIMITS.nameMax} characters or fewer.` });
  }

  if (email === null || email.length === 0) {
    errors.push({ field: "email", message: "Please enter your email address." });
  } else if (email.length > CONTACT_LIMITS.emailMax) {
    errors.push({ field: "email", message: `Email must be ${CONTACT_LIMITS.emailMax} characters or fewer.` });
  } else if (!EMAIL_RE.test(email)) {
    errors.push({ field: "email", message: "Please enter a valid email address, like you@company.com." });
  }

  if (message === null || message.length < CONTACT_LIMITS.messageMin) {
    errors.push({
      field: "message",
      message: `Please tell us a bit more — at least ${CONTACT_LIMITS.messageMin} characters.`,
    });
  } else if (message.length > CONTACT_LIMITS.messageMax) {
    errors.push({ field: "message", message: `Message must be ${CONTACT_LIMITS.messageMax} characters or fewer.` });
  }

  if (company === null) {
    errors.push({ field: "company", message: "Company must be text." });
  } else if (company.length > CONTACT_LIMITS.companyMax) {
    errors.push({ field: "company", message: `Company must be ${CONTACT_LIMITS.companyMax} characters or fewer.` });
  }

  if (errors.length > 0 || name === null || email === null || message === null || company === null) {
    return { ok: false, errors };
  }

  const value: ContactInput = { name, email, message };
  if (company.length > 0) value.company = company;
  // A non-string honeypot is still a bot signal.
  if (website === null) value.website = "filled";
  else if (website.length > 0) value.website = website;
  return { ok: true, value };
}
