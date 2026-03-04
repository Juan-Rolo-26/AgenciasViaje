import { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext.jsx";

export default function StatsView() {
    const { apiFetch } = useAdmin();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        apiFetch("/api/admin/stats").then(setStats).catch(() => { });
    }, [apiFetch]);

    const cards = stats ? [
        { label: "Destinos", value: stats.totalDestinos, icon: "🌍", color: "#7c3aed" },
        { label: "Paquetes", value: stats.totalPaquetes, icon: "🧳", color: "#0ea5e9" },
        { label: "Salidas Grupales", value: stats.totalGrupales, icon: "👥", color: "#10b981" },
        { label: "Total Ofertas", value: stats.totalOfertas, icon: "📦", color: "#f59e0b" },
        { label: "Actividades", value: stats.totalActividades, icon: "🏄", color: "#ef4444" },
    ] : [];

    return (
        <div>
            <div className="view-header">
                <h2>Dashboard</h2>
                <p>Resumen general de la agencia</p>
            </div>

            {!stats ? (
                <p className="loading">Cargando estadísticas...</p>
            ) : (
                <div className="stats-grid">
                    {cards.map((c) => (
                        <div className="stat-card" key={c.label} style={{ "--cc": c.color }}>
                            <span className="stat-icon">{c.icon}</span>
                            <div>
                                <div className="stat-val">{c.value}</div>
                                <div className="stat-lbl">{c.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="welcome-box">
                <h3>¡Bienvenida al CRM de Topotours! 👋</h3>
                <ul>
                    <li>✅ Administrá <strong>Destinos</strong> con imágenes y galería</li>
                    <li>✅ Gestioná <strong>Paquetes individuales</strong> con servicios y fechas</li>
                    <li>✅ Administrá <strong>Salidas Grupales</strong> con sus fechas de partida</li>
                    <li>✅ Activá / desactivá cualquier oferta con un solo click</li>
                </ul>
            </div>
        </div>
    );
}
