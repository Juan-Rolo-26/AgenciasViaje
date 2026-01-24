import { resolveAssetUrl } from "./assetUrl.js";

const EXCURSION_GALLERIES = {
  "capilla-del-monte-valle-de-punilla": [
    "/assets/destinos/punilla.jpg",
    "/assets/destinos/punilla2.jpg",
    "/assets/destinos/punilla3.jpg"
  ],
  "villa-general-belgrano-valle-de-calamuchita": [
    "/assets/destinos/calamuchita.jpg",
    "/assets/destinos/calamuchita2.jpg",
    "/assets/destinos/calamuchita3.jpg"
  ],
  "mina-clavero-valle-de-traslasierra": [
    "/assets/destinos/traslasierras1.jpg",
    "/assets/destinos/traslasierras2.jpg",
    "/assets/destinos/traslasierra3.jpg"
  ],
  "camino-de-la-historia-estancias-jesuiticas": [
    "/assets/destinos/camino.jpg",
    "/assets/destinos/camino2.webp",
    "/assets/destinos/camino3.jpg"
  ],
  "la-cumbrecita-pueblo-peatonal": [
    "/assets/destinos/cumbrecita1.jpg",
    "/assets/destinos/cumbrecita2.jpg",
    "/assets/destinos/cumbrecita3.jpg"
  ],
  "alta-gracia-carlos-paz-combo": [
    "/assets/destinos/altagracia1.jpg",
    "/assets/destinos/altagracia2.jpg",
    "/assets/destinos/carlospaz1.webp"
  ],
  "cerro-colorado-region-norte": [
    "/assets/destinos/cerrocolorado1.jpg",
    "/assets/destinos/cerrocolorado2.jpg",
    "/assets/destinos/cerrocolorado3.jpg"
  ],
  "mar-de-ansenuza-leyendas-y-flamencos": [
    "/assets/destinos/ansenuza.jpg",
    "/assets/destinos/ansenuza2.jpg",
    "/assets/destinos/ansenuza3.jpg"
  ],
  "villa-carlos-paz-corazon-de-cordoba": [
    "/assets/destinos/carlospaz1.webp",
    "/assets/destinos/carlospaz2.jpg",
    "/assets/destinos/carlospaz3.jpg"
  ],
  "alta-gracia-jesuitas": [
    "/assets/destinos/altagracia1.jpg",
    "/assets/destinos/altagracia2.jpg",
    "/assets/destinos/altagracia3.jpg"
  ],
  "jesus-maria-camino-real": [
    "/assets/destinos/jesusmaria1.jpg",
    "/assets/destinos/jesusmaria2.jpg",
    "/assets/destinos/jesusmaria3.jpg"
  ],
  "sierras-chicas-region-de-la-historia": [
    "/assets/destinos/sierraschicas1.jpg",
    "/assets/destinos/sierrraschicas2.jpg",
    "/assets/destinos/sierraschicas3.jpeg"
  ],
  "paseo-del-indio-perla-de-las-sierras": [
    "/assets/destinos/paseoindio1.jpg",
    "/assets/destinos/paseoindiio2.jpg",
    "/assets/destinos/paseoindio4.jpg"
  ],
  "ruta-del-vino-de-cordoba": [
    "/assets/destinos/ruta2.jpg",
    "/assets/destinos/ruta3.jpg",
    "/assets/destinos/ruta4.jpg"
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
