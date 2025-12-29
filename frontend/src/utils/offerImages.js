import { resolveAssetUrl } from "./assetUrl.js";

export function getOfferImages(oferta) {
  const images = [];

  if (oferta?.destino?.imagenPortada) {
    images.push(resolveAssetUrl(oferta.destino.imagenPortada));
  }

  (oferta?.destinos || []).forEach((item) => {
    const image = item?.destino?.imagenPortada;
    const resolved = resolveAssetUrl(image);
    if (resolved && !images.includes(resolved)) {
      images.push(resolved);
    }
  });

  return images;
}
