import { useEffect, useState } from "react";
import "../assets/search-loading.css";

export default function SearchLoadingAnimation({ searchType = "destino" }) {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const getMessage = () => {
        switch (searchType) {
            case "destino":
                return "Buscando destinos";
            case "oferta":
                return "Buscando salidas grupales";
            case "excursion":
                return "Buscando excursiones";
            case "paquete":
                return "Buscando paquetes";
            default:
                return "Buscando productos";
        }
    };

    return (
        <div className="search-loading-overlay">
            <div className="search-loading-container">
                <div className="search-loading-animation">
                    {/* Órbita con avión */}
                    <div className="flight-orbit">
                        <svg className="paper-plane" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2 12L22 2L13 22L11 13L2 12Z" />
                        </svg>
                    </div>

                    {/* Mapa mundi de fondo */}
                    <div className="world-map">
                        <svg viewBox="0 0 200 100">
                            <path d="M10,50 Q30,20 50,40 T90,45 T130,35 T170,50" />
                            <path d="M20,60 Q40,80 60,60 T100,55 T140,65 T180,60" />
                            <path d="M15,35 Q35,15 55,30 T95,25 T135,20 T175,35" />
                            <path d="M25,70 Q45,90 65,75 T105,70 T145,80 T185,70" />
                        </svg>
                    </div>
                </div>

                <p className="search-loading-text">
                    {getMessage()}
                    <span className="search-loading-dots">{dots}</span>
                </p>
            </div>
        </div>
    );
}
