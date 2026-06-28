export type CustomerAccount = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
};

type StoredCustomerAccount = CustomerAccount & {
  password: string;
};

const ACCOUNTS_STORAGE_KEY = "menmitha_customer_accounts";
const SESSION_STORAGE_KEY = "menmitha_customer_session";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "") as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function publicAccount(account: StoredCustomerAccount): CustomerAccount {
  const { password: _password, ...customer } = account;
  return customer;
}

export function getCustomerAccounts() {
  return readJson<StoredCustomerAccount[]>(ACCOUNTS_STORAGE_KEY, []);
}

export function getCurrentCustomer() {
  const session = readJson<{ email: string } | undefined>(SESSION_STORAGE_KEY, undefined);
  if (!session?.email) return undefined;

  const account = getCustomerAccounts().find((item) => item.email === session.email);
  return account ? publicAccount(account) : undefined;
}

export function signUpCustomer(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const name = payload.name.trim();
  const email = normalizeEmail(payload.email);
  const password = payload.password.trim();
  const phone = payload.phone?.trim();

  if (!name) throw new Error("Name is required.");
  if (!email || !email.includes("@")) throw new Error("Enter a valid email address.");
  if (password.length < 6) throw new Error("Password must be at least 6 characters.");

  const accounts = getCustomerAccounts();
  if (accounts.some((account) => account.email === email)) {
    throw new Error("An account already exists for this email.");
  }

  const account: StoredCustomerAccount = {
    id: `customer-${Date.now()}`,
    name,
    email,
    phone,
    password,
    createdAt: new Date().toISOString(),
  };

  writeJson(ACCOUNTS_STORAGE_KEY, [account, ...accounts]);
  writeJson(SESSION_STORAGE_KEY, { email });
  return publicAccount(account);
}

export function signInCustomer(emailInput: string, passwordInput: string) {
  const email = normalizeEmail(emailInput);
  const password = passwordInput.trim();
  const account = getCustomerAccounts().find((item) => item.email === email);

  if (!account || account.password !== password) {
    throw new Error("Email or password is incorrect.");
  }

  writeJson(SESSION_STORAGE_KEY, { email });
  return publicAccount(account);
}

export function updateCurrentCustomer(patch: Pick<CustomerAccount, "name" | "phone" | "address">) {
  const current = getCurrentCustomer();
  if (!current) throw new Error("Please sign in first.");

  const accounts = getCustomerAccounts();
  const updatedAccounts = accounts.map((account) =>
    account.email === current.email
      ? {
          ...account,
          name: patch.name.trim() || account.name,
          phone: patch.phone?.trim(),
          address: patch.address?.trim(),
        }
      : account,
  );

  writeJson(ACCOUNTS_STORAGE_KEY, updatedAccounts);
  return getCurrentCustomer();
}

export function signOutCustomer() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}
