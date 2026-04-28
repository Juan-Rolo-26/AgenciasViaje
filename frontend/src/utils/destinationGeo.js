const ARGENTINA_REGION_KEYS = new Set([
  "argentina",
  "buenos aires",
  "caba",
  "catamarca",
  "chaco",
  "chubut",
  "ciudad autonoma de buenos aires",
  "cordoba",
  "corrientes",
  "entre rios",
  "formosa",
  "jujuy",
  "la pampa",
  "la rioja",
  "mendoza",
  "misiones",
  "neuquen",
  "rio negro",
  "salta",
  "san juan",
  "san luis",
  "santa cruz",
  "santa fe",
  "santiago del estero",
  "tierra del fuego",
  "tucuman"
]);

export function normalizeDestinationRegion(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function isArgentinaDestination(paisRegion) {
  return ARGENTINA_REGION_KEYS.has(normalizeDestinationRegion(paisRegion));
}

export function matchesDestinationPais(paisRegion, paisFilter) {
  if (!paisFilter) {
    return true;
  }

  const normalizedFilter = normalizeDestinationRegion(paisFilter);
  if (normalizedFilter === "argentina") {
    return isArgentinaDestination(paisRegion);
  }

  return normalizeDestinationRegion(paisRegion) === normalizedFilter;
}

export function matchesDestinationContinent(
  paisRegion,
  continentByCountry,
  continentFilter
) {
  if (!continentFilter) {
    return true;
  }

  if (continentFilter === "america" && isArgentinaDestination(paisRegion)) {
    return false;
  }

  const pais = (paisRegion || "").trim();
  return (continentByCountry[pais] || "") === continentFilter;
}

export function shouldShowCountryInContinent(
  country,
  continentByCountry,
  continentFilter
) {
  if (!continentFilter) {
    return true;
  }

  if ((continentByCountry[country] || "") !== continentFilter) {
    return false;
  }

  if (continentFilter === "america" && isArgentinaDestination(country)) {
    return false;
  }

  return true;
}
