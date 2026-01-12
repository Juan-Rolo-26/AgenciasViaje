import { resolveAssetUrl } from "./assetUrl.js";

const EXCURSION_GALLERIES = {
  "valle-de-punilla": [
    "/assets/destinos/punilla.jpg",
    "/assets/destinos/punilla2.jpg",
    "/assets/destinos/punilla3.jpg"
  ],
  "valle-de-traslasierra": [
    "/assets/destinos/traslasierras1.jpg",
    "/assets/destinos/traslasierras2.jpg",
    "/assets/destinos/traslasierra3.jpg"
  ],
  "mar-de-ansenuza": [
    "/assets/destinos/ansenuza.jpg",
    "/assets/destinos/ansenuza2.jpg",
    "/assets/destinos/ansenuza3.jpg"
  ],
  "valle-de-calamuchita": [
    "/assets/destinos/calamuchita.jpg",
    "/assets/destinos/calamuchita2.jpg",
    "/assets/destinos/calamuchita3.jpg"
  ],
  "ruta-del-vino-de-cordoba": [
    "/assets/destinos/ruta2.jpg",
    "/assets/destinos/ruta3.jpg",
    "/assets/destinos/ruta4.jpg"
  ],
  "camino-de-las-estancias-jesuiticas": [
    "/assets/destinos/camino.jpg",
    "/assets/destinos/camino2.webp",
    "/assets/destinos/camino3.jpg"
  ],
  "cordoba-a-tu-medida": [
    "/assets/destinos/punilla2.jpg",
    "/assets/destinos/traslasierras2.jpg",
    "/assets/destinos/ansenuza2.jpg"
  ],
  "visita-cordoba-a-tu-medida": [
    "/assets/destinos/calamuchita2.jpg",
    "/assets/destinos/ruta2.jpg",
    "/assets/destinos/camino2.webp"
  ]
};

export function getExcursionGallery(slug) {
  const images = EXCURSION_GALLERIES[slug] || [];
  return images.map((image) => resolveAssetUrl(image)).filter(Boolean);
}
