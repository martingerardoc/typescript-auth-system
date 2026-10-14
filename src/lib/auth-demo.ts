
export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
}

export interface DemoAccount extends UserProfile {
  passwordSalt: string;
  passwordHash: string;
}

const ACCOUNTS_KEY = "typescript-auth-demo-accounts";

function getAccounts(): DemoAccount[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = localStorage.getItem(ACCOUNTS_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(stored);

    if (Array.isArray(parsed)) {
      return parsed as DemoAccount[];
    }
  } catch {
    localStorage.removeItem(ACCOUNTS_KEY);
  }

  return [];
}

function saveAccounts(accounts: DemoAccount[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

async function hashPassword(
  password: string,
  salt: string
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100_000,
      hash: "SHA-256",
    },
    key,
    256
  );

  return Array.from(new Uint8Array(bits))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function registerAccount(input: {
  fullName: string;
  username: string;
  email: string;
  password: string;
}): Promise<UserProfile> {
  const fullName = input.fullName.trim();
  const username = input.username.trim();
  const email = input.email.trim().toLowerCase();

  if (!fullName || !username || !email || !input.password) {
    throw new Error("All fields are required.");
  }

  if (input.password.length < 8) {
    throw new Error("Password must contain at least 8 characters.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }

  const accounts = getAccounts();

  if (
    accounts.some(
      (account) => account.username.toLowerCase() === username.toLowerCase()
    )
  ) {
    throw new Error("That username is already registered.");
  }

  if (accounts.some((account) => account.email === email)) {
    throw new Error("That email is already registered.");
  }

  const passwordSalt = crypto.randomUUID();
  const passwordHash = await hashPassword(input.password, passwordSalt);

  const user: DemoAccount = {
    id: crypto.randomUUID(),
    fullName,
    username,
    email,
    passwordSalt,
    passwordHash,
  };

  saveAccounts([...accounts, user]);

  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
  };
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<UserProfile> {
  const account = getAccounts().find(
    (item) => item.username.toLowerCase() === username.trim().toLowerCase()
  );

  if (!account) {
    throw new Error("Invalid username or password.");
  }

  const hash = await hashPassword(password, account.passwordSalt);

  if (hash !== account.passwordHash) {
    throw new Error("Invalid username or password.");
  }

  return {
    id: account.id,
    fullName: account.fullName,
    username: account.username,
    email: account.email,
  };
}

export function updateAccountProfile(
  id: string,
  input: { fullName: string; email: string }
): UserProfile {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();

  if (!fullName || !email) {
    throw new Error("Name and email are required.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }

  const accounts = getAccounts();
  const index = accounts.findIndex((account) => account.id === id);

  if (index === -1) {
    throw new Error("Account not found.");
  }

  if (
    accounts.some(
      (account) => account.id !== id && account.email === email
    )
  ) {
    throw new Error("That email is already in use.");
  }

  const updated = {
    ...accounts[index],
    fullName,
    email,
  };

  accounts[index] = updated;
  saveAccounts(accounts);

  return {
    id: updated.id,
    fullName: updated.fullName,
    username: updated.username,
    email: updated.email,
  };
}
