import { useEffect, useState } from "react";
import { apiRequest } from "../api/api.js";
import { resolveAssetUrl } from "../utils/assetUrl.js";

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

        const normalizeDestino = (destino) => {
          if (!destino) {
            return destino;
          }
          return {
            ...destino,
            imagenPortada: resolveAssetUrl(destino.imagenPortada),
            galeria: Array.isArray(destino.galeria)
              ? destino.galeria.map((item) => ({
                  ...item,
                  imagen: resolveAssetUrl(item.imagen)
                }))
              : destino.galeria
          };
        };

        const normalizeActividad = (actividad) => {
          if (!actividad) {
            return actividad;
          }
          return {
            ...actividad,
            imagenPortada: resolveAssetUrl(actividad.imagenPortada)
          };
        };

        const normalizeOferta = (oferta) => {
          if (!oferta) {
            return oferta;
          }
          return {
            ...oferta,
            destino: oferta.destino ? normalizeDestino(oferta.destino) : oferta.destino,
            destinos: Array.isArray(oferta.destinos)
              ? oferta.destinos.map((item) => ({
                  ...item,
                  destino: item.destino ? normalizeDestino(item.destino) : item.destino
                }))
              : oferta.destinos,
            actividades: Array.isArray(oferta.actividades)
              ? oferta.actividades.map((item) => ({
                  ...item,
                  actividad: item.actividad
                    ? normalizeActividad(item.actividad)
                    : item.actividad
                }))
              : oferta.actividades
          };
        };

        const normalizedDestinos = Array.isArray(destinosData)
          ? destinosData.map(normalizeDestino)
          : [];
        const normalizedOfertas = Array.isArray(ofertasData)
          ? ofertasData.map(normalizeOferta)
          : [];
        const normalizedActividades = Array.isArray(actividadesData)
          ? actividadesData.map(normalizeActividad)
          : [];

        setDestinos(normalizedDestinos);
        setOfertas(normalizedOfertas);
        setActividades(normalizedActividades);
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
