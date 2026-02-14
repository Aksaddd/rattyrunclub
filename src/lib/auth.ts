import { randomBytes, pbkdf2Sync, timingSafeEqual, createHmac } from "crypto";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const CREDENTIALS_PATH = join(process.cwd(), "data", "credentials.json");
const PBKDF2_ITERATIONS = 120_000;
const PBKDF2_KEYLEN = 64;
const PBKDF2_DIGEST = "sha512";
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface Credentials {
  adminPasswordHash: string;
  adminPasswordSalt: string;
  sessionSecret: string;
}

export async function getCredentials(): Promise<Credentials | null> {
  try {
    const data = await readFile(CREDENTIALS_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function saveCredentials(creds: Credentials): Promise<void> {
  await writeFile(CREDENTIALS_PATH, JSON.stringify(creds, null, 2), "utf-8");
}

function hashPassword(password: string, salt: string): string {
  return pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_KEYLEN,
    PBKDF2_DIGEST
  ).toString("hex");
}

export async function setupAdmin(password: string): Promise<boolean> {
  const existing = await getCredentials();
  if (existing) return false; // already set up

  const salt = randomBytes(32).toString("hex");
  const hash = hashPassword(password, salt);
  const sessionSecret = randomBytes(48).toString("hex");

  await saveCredentials({
    adminPasswordHash: hash,
    adminPasswordSalt: salt,
    sessionSecret,
  });

  return true;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  const valid = await verifyPassword(currentPassword);
  if (!valid) return false;

  const creds = await getCredentials();
  if (!creds) return false;

  const salt = randomBytes(32).toString("hex");
  const hash = hashPassword(newPassword, salt);
  // Rotate session secret so old sessions are invalidated
  const sessionSecret = randomBytes(48).toString("hex");

  await saveCredentials({
    adminPasswordHash: hash,
    adminPasswordSalt: salt,
    sessionSecret,
  });

  return true;
}

export async function verifyPassword(password: string): Promise<boolean> {
  const creds = await getCredentials();
  if (!creds) return false;

  const hash = hashPassword(password, creds.adminPasswordSalt);
  const expected = Buffer.from(creds.adminPasswordHash, "hex");
  const actual = Buffer.from(hash, "hex");

  return timingSafeEqual(expected, actual);
}

export async function createSessionToken(): Promise<string> {
  const creds = await getCredentials();
  if (!creds) throw new Error("No credentials configured");

  const payload = {
    sub: "admin",
    iat: Date.now(),
    exp: Date.now() + SESSION_EXPIRY_MS,
    jti: randomBytes(16).toString("hex"),
  };

  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", creds.sessionSecret)
    .update(data)
    .digest("base64url");

  return `${data}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const creds = await getCredentials();
  if (!creds) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [data, sig] = parts;
  const expectedSig = createHmac("sha256", creds.sessionSecret)
    .update(data)
    .digest("base64url");

  // Timing-safe comparison of signatures
  if (sig.length !== expectedSig.length) return false;
  const sigMatch = timingSafeEqual(
    Buffer.from(sig),
    Buffer.from(expectedSig)
  );
  if (!sigMatch) return false;

  // Check expiry
  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf-8")
    );
    if (payload.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export const SESSION_COOKIE = "ratty_session";
