import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

export const AdminContext = createContext(null);

export function AdminProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("crm_token") || "");
    const [toast, setToast] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const toastTimeoutRef = useRef(null);

    const login = useCallback((secret) => {
        localStorage.setItem("crm_token", secret);
        setToken(secret);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("crm_token");
        setToken("");
    }, []);

    const showToast = useCallback((type, msg) => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        setToast({ type, msg, id: Date.now() });
        toastTimeoutRef.current = setTimeout(() => setToast(null), 3500);
    }, []);

    useEffect(() => {
        return () => {
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function validateSession() {
            if (!token) {
                if (!cancelled) setCheckingAuth(false);
                return;
            }

            try {
                const res = await fetch("/api/admin/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("invalid-token");
            } catch {
                localStorage.removeItem("crm_token");
                if (!cancelled) {
                    setToken("");
                    showToast("error", "Tu sesión expiró. Volvé a ingresar.");
                }
            } finally {
                if (!cancelled) setCheckingAuth(false);
            }
        }

        setCheckingAuth(true);
        validateSession();

        return () => {
            cancelled = true;
        };
    }, [token, showToast]);

    const apiFetch = useCallback(async (path, opts = {}) => {
        const headers = {
            ...(opts.headers || {}),
            Authorization: `Bearer ${token}`,
        };

        if (opts.body !== undefined && !headers["Content-Type"]) {
            headers["Content-Type"] = "application/json";
        }

        const res = await fetch(path, {
            ...opts,
            headers,
            body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
        });

        const contentType = res.headers.get("content-type") || "";
        const isJson = contentType.includes("application/json");
        let payload = null;

        if (res.status !== 204) {
            payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");
        }

        if (!res.ok) {
            if (res.status === 401) {
                logout();
                throw new Error("Sesión expirada. Ingresá nuevamente.");
            }

            const message = typeof payload === "string"
                ? payload
                : payload?.error || payload?.message;
            throw new Error(message || "Error en la solicitud");
        }

        return payload;
    }, [logout, token]);

    return (
        <AdminContext.Provider value={{ token, login, logout, apiFetch, toast, showToast, checkingAuth }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    return useContext(AdminContext);
}
