import { useMemo, useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import Toast from "../components/Toast.jsx";
import Sidebar from "../components/Sidebar.jsx";
import StatsView from "../components/StatsView.jsx";
import DestinosView from "../components/DestinosView.jsx";
import OfertasView from "../components/OfertasView.jsx";
import ExcursionesView from "../components/ExcursionesView.jsx";
import CrucerosView from "../components/CrucerosView.jsx";
import ModoFanaticoView from "../components/ModoFanaticoView.jsx";

const MENU = [
    { id: "stats", label: "Dashboard", icon: "📊" },
    { id: "destinos", label: "Destinos", icon: "🌍" },
    { id: "paquetes", label: "Paquetes", icon: "🧳" },
    { id: "grupales", label: "Salidas Grupales", icon: "👥" },
    { id: "excursiones", label: "Excursiones", icon: "🏄" },
    { id: "cruceros", label: "Cruceros", icon: "🚢" },
    { id: "fanatico", label: "Modo Fanático", icon: "⚽" },
];

export default function Dashboard() {
    const { toast, logout } = useAdmin();
    const [active, setActive] = useState("stats");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const activeLabel = useMemo(
        () => MENU.find((item) => item.id === active)?.label || "Dashboard",
        [active]
    );

    useEffect(() => {
        function onKeyDown(event) {
            if (event.key === "Escape") setSidebarOpen(false);
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    function renderView() {
        switch (active) {
            case "stats": return <StatsView />;
            case "destinos": return <DestinosView />;
            case "paquetes": return <OfertasView tipo="individual" titulo="Paquetes" />;
            case "grupales": return <OfertasView tipo="grupal" titulo="Salidas Grupales" />;
            case "excursiones": return <ExcursionesView />;
            case "cruceros": return <CrucerosView />;
            case "fanatico": return <ModoFanaticoView />;
            default: return <StatsView />;
        }
    }


    return (
        <div className="layout">
            {toast && <Toast key={toast.id} type={toast.type} msg={toast.msg} />}
            {sidebarOpen && <button className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú" />}
            <Sidebar
                menu={MENU}
                active={active}
                onSelect={setActive}
                onLogout={logout}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <main className="main">
                <div className="main-inner">
                    <header className="mobile-topbar">
                        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
                            ☰
                        </button>
                        <div className="mobile-topbar-title">{activeLabel}</div>
                    </header>
                    {renderView()}
                </div>
            </main>
        </div>
    );
}
