const { createResponseCache } = require("../middleware/responseCache");

const destinosCache = createResponseCache();
const ofertasCache = createResponseCache();
const actividadesCache = createResponseCache();
const crucerosCache = createResponseCache();
const fanaticoCache = createResponseCache();

function clearAllPublicCaches() {
  destinosCache.clear();
  ofertasCache.clear();
  actividadesCache.clear();
  crucerosCache.clear();
  fanaticoCache.clear();
}

module.exports = {
  destinosCache,
  ofertasCache,
  actividadesCache,
  crucerosCache,
  fanaticoCache,
  clearAllPublicCaches,
};
