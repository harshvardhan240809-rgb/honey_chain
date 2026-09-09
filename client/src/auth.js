const STORAGE_KEY = 'honeychain-auth';

export const AUTH_USERS = {
  beekeeper: { username: 'beekeeper@example.com', password: 'demo123', role: 'beekeeper', name: 'Demo Beekeeper' },
  lab: { username: 'lab@example.com', password: 'demo123', role: 'lab', name: 'Demo Lab' },
  admin: { username: 'admin@example.com', password: 'demo123', role: 'admin', name: 'Platform Admin' },
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
  if (role === 'admin') return '/admin';
  if (role === 'lab') return '/lab';
  return '/dashboard';
}
