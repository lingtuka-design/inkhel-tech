export const ADMIN_CREDENTIALS = {
  username: 'lingtuka',
  password: 'MAWLA1984@mala',
};

const AUTH_KEY = 'inkhel_admin_auth';
const USER_KEY = 'inkhel_admin_user';

export function checkIsAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

export function loginAdmin(username: string, password: string): boolean {
  if (
    username.trim().toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() &&
    password === ADMIN_CREDENTIALS.password
  ) {
    sessionStorage.setItem(AUTH_KEY, 'true');
    sessionStorage.setItem(USER_KEY, ADMIN_CREDENTIALS.username);
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function getLoggedInUser(): string | null {
  return sessionStorage.getItem(USER_KEY);
}
