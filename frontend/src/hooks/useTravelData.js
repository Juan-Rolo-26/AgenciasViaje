import { useEffect, useState } from "react";
import { apiRequest } from "../api/api.js";
import { resolveAssetUrl } from "../utils/assetUrl.js";

const CACHE_TTL_MS = 0;

const datasetCache = {
  destinos: { data: null, timestamp: 0, promise: null },
  ofertas: { data: null, timestamp: 0, promise: null },
  actividades: { data: null, timestamp: 0, promise: null }
};

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

const isFresh = (cacheEntry) =>
  cacheEntry.data &&
  Date.now() - cacheEntry.timestamp < CACHE_TTL_MS;

async function fetchDataset(key, url, normalizeFn) {
  const cacheEntry = datasetCache[key];
  if (isFresh(cacheEntry)) {
    return cacheEntry.data;
  }
  if (cacheEntry.promise) {
    return cacheEntry.promise;
  }

  cacheEntry.promise = apiRequest(url)
    .then((data) => {
      const normalized = Array.isArray(data) ? data.map(normalizeFn) : [];
      cacheEntry.data = normalized;
      cacheEntry.timestamp = Date.now();
      return normalized;
    })
    .finally(() => {
      cacheEntry.promise = null;
    });

  return cacheEntry.promise;
}

function useDataset(key, url, normalizeFn) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (isFresh(datasetCache[key])) {
        setData(datasetCache[key].data);
        setLoading(false);
        return;
      }

      try {
        const result = await fetchDataset(key, url, normalizeFn);
        if (!isMounted) {
          return;
        }
        setData(result);
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
  }, [key, url, normalizeFn]);

  return { data, loading, error };
}

export function useDestinos() {
  const { data, loading, error } = useDataset(
    "destinos",
    "/api/destinos?lite=1",
    normalizeDestino
  );

  return { destinos: data, loading, error };
}

export function useOfertas() {
  const { data, loading, error } = useDataset(
    "ofertas",
    "/api/ofertas?lite=1",
    normalizeOferta
  );

  return { ofertas: data, loading, error };
}

export function useActividades() {
  const { data, loading, error } = useDataset(
    "actividades",
    "/api/actividades?lite=1",
    normalizeActividad
  );

  return { actividades: data, loading, error };
}

export function useTravelData() {
  const [destinos, setDestinos] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [destinosData, ofertasData, actividadesData] =
          await Promise.all([
            fetchDataset("destinos", "/api/destinos?lite=1", normalizeDestino),
            fetchDataset("ofertas", "/api/ofertas?lite=1", normalizeOferta),
            fetchDataset(
              "actividades",
              "/api/actividades?lite=1",
              normalizeActividad
            )
          ]);

        if (!isMounted) {
          return;
        }
        setDestinos(destinosData);
        setOfertas(ofertasData);
        setActividades(actividadesData);
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
    loading,
    error
  };
}
