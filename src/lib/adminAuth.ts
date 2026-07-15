// Auth de administración del lado cliente: guarda el token firmado que emite el
// servidor y lo adjunta a las peticiones admin. Reemplaza a las credenciales que
// antes estaban hardcodeadas en el bundle (cualquiera podía leerlas).
const KEY = "xiaomi_admin_token";

export const getToken = (): string => {
  try {
    return sessionStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
};

export const setToken = (t: string): void => {
  try {
    sessionStorage.setItem(KEY, t);
  } catch {
    /* sessionStorage no disponible */
  }
};

export const clearToken = (): void => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
};

export const isAuthed = (): boolean => getToken() !== "";

// Cabeceras con el Bearer token para las peticiones admin.
export const authHeaders = (): Record<string, string> => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// Valida credenciales contra el servidor; NO valida nada en el cliente.
export async function adminLogin(email: string, password: string): Promise<boolean> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return false;
  const data = await res.json().catch(() => null);
  if (data?.token) {
    setToken(data.token);
    return true;
  }
  return false;
}
