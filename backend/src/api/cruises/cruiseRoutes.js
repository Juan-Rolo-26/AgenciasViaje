const express = require("express");
const { crucerosCache: cache } = require("../../lib/publicCaches");
const {
  listCruceros,
  getCruceroById,
  getCruceroBySlug
} = require("./cruiseController");

const router = express.Router();

router.get("/", cache, listCruceros);
router.get("/slug/:slug", cache, getCruceroBySlug);
router.get("/:id", cache, getCruceroById);

module.exports = router;
