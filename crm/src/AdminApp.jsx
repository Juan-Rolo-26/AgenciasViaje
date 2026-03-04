import { AdminProvider, useAdmin } from "./context/AdminContext.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function AppShell() {
    const { token, checkingAuth } = useAdmin();
    if (checkingAuth) {
        return (
            <div className="auth-loading">
                <div className="auth-loading-card">
                    <div className="auth-spinner" />
                    <p>Validando sesión...</p>
                </div>
            </div>
        );
    }
    return token ? <Dashboard /> : <Login />;
}

export default function AdminApp() {
    return (
        <AdminProvider>
            <AppShell />
        </AdminProvider>
    );
}
