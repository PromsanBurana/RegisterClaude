import type {
  AuthUser,
  BatchAvailability,
  Registration,
  RegistrationInput,
  RegistrationStatus,
} from './types';

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function parse<T>(res: Response): Promise<T> {
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* no body */
  }
  if (!res.ok) {
    throw new ApiError(
      body?.error || `HTTP ${res.status}`,
      res.status,
      body?.errors,
    );
  }
  return body as T;
}

const credOpts: RequestInit = { credentials: 'include' };

// ---------- Auth ----------

export async function login(
  username: string,
  password: string,
): Promise<AuthUser> {
  const res = await fetch('/api/auth/login', {
    ...credOpts,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const body = await parse<{ ok: true; user: AuthUser }>(res);
  return body.user;
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { ...credOpts, method: 'POST' });
}

export async function me(): Promise<AuthUser | null> {
  const res = await fetch('/api/auth/me', credOpts);
  if (res.status === 401) return null;
  if (!res.ok) throw new ApiError(`HTTP ${res.status}`, res.status);
  const body = (await res.json()) as { user: AuthUser };
  return body.user;
}

// ---------- Batch availability (public) ----------

export async function getBatchAvailability(): Promise<BatchAvailability[]> {
  return parse<BatchAvailability[]>(await fetch('/api/batches', credOpts));
}

// ---------- Registrations ----------

export async function getRegistrations(): Promise<Registration[]> {
  return parse<Registration[]>(await fetch('/api/registrations', credOpts));
}

export async function createRegistration(
  payload: RegistrationInput,
): Promise<Registration> {
  return parse<Registration>(
    await fetch('/api/registrations', {
      ...credOpts,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus,
): Promise<Registration> {
  return parse<Registration>(
    await fetch(`/api/registrations/${encodeURIComponent(id)}/status`, {
      ...credOpts,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }),
  );
}

export async function deleteRegistration(
  id: string,
): Promise<{ ok: boolean }> {
  return parse<{ ok: boolean }>(
    await fetch(`/api/registrations/${encodeURIComponent(id)}`, {
      ...credOpts,
      method: 'DELETE',
    }),
  );
}
