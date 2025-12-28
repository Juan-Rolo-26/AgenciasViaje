export function getOfferImages(oferta) {
  const images = [];

  if (oferta?.destino?.imagenPortada) {
    images.push(oferta.destino.imagenPortada);
  }

  (oferta?.destinos || []).forEach((item) => {
    const image = item?.destino?.imagenPortada;
    if (image && !images.includes(image)) {
      images.push(image);
    }
  });

  return images;
}
