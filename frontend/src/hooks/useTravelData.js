import { useEffect, useState } from "react";
import { apiRequest } from "../api/api.js";

export function useTravelData() {
  const [destinos, setDestinos] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [aboutSections, setAboutSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [destinosData, ofertasData, actividadesData, aboutData] =
          await Promise.all([
            apiRequest("/api/destinos"),
            apiRequest("/api/ofertas"),
            apiRequest("/api/actividades"),
            apiRequest("/api/nosotros")
          ]);

        if (!isMounted) {
          return;
        }
        setDestinos(destinosData);
        setOfertas(ofertasData);
        setActividades(actividadesData);
        setAboutSections(Array.isArray(aboutData) ? aboutData : []);
        setError("");
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setError(err?.message || "No pudimos cargar la información.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    destinos,
    ofertas,
    actividades,
    aboutSections,
    loading,
    error
  };
}
