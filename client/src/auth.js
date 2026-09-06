const STORAGE_KEY = 'honeychain-auth';

export const AUTH_USERS = {
  admin: { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
  user: { username: 'user', password: 'user123', role: 'user', name: 'Field User' },
};

export function getAuthSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function loginUser(username, password) {
  const normalizedUser = String(username || '').trim().toLowerCase();
  const normalizedPassword = String(password || '').trim();

  const match = Object.values(AUTH_USERS).find(
    (user) => user.username === normalizedUser && user.password === normalizedPassword
  );

  if (!match) return null;

  const session = { username: match.username, name: match.name, role: match.role };
  setAuthSession(session);
  return session;
}

export function getDefaultRoute(role) {
  return role === 'admin' ? '/admin' : '/dashboard';
}
