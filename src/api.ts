import type {
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

export async function getRegistrations(): Promise<Registration[]> {
  return parse<Registration[]>(await fetch('/api/registrations'));
}

export async function createRegistration(
  payload: RegistrationInput,
): Promise<Registration> {
  return parse<Registration>(
    await fetch('/api/registrations', {
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
      method: 'DELETE',
    }),
  );
}
