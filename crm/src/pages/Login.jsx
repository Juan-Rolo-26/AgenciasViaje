import { useState } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import logo from "../assets/topotours-logo.png";

export default function Login() {
    const { login, showToast } = useAdmin();
    const [secret, setSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        if (!secret.trim()) return;
        setLoading(true);
        setErr("");
        try {
            const res = await fetch("/api/admin/me", {
                headers: { Authorization: `Bearer ${secret}` },
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Clave incorrecta");
            }
            login(secret);
            showToast("success", "Bienvenida al CRM de Topotours 👋");
        } catch (error) {
            setErr(error.message || "Clave de acceso incorrecta. Intentá de nuevo.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <img src={logo} alt="Logo Topotours" className="brand-logo-image" />
                    <div>
                        <div className="login-brand">Topotours</div>
                        <div className="login-sub">Panel de Administración</div>
                    </div>
                </div>

                <h1>Ingresar al CRM</h1>
                <p>Ingresá la clave secreta para gestionar la agencia</p>

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Clave de acceso</label>
                        <input
                            type="password"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            placeholder="••••••••••••"
                            autoComplete="current-password"
                            autoFocus
                            required
                        />
                    </div>
                    {err && <div className="error-msg">⚠️ {err}</div>}
                    <button type="submit" className="btn-primary full" disabled={loading}>
                        {loading ? "Verificando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
}
