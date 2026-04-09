const express = require("express");
const { createResponseCache } = require("../../middleware/responseCache");
const {
  listCruceros,
  getCruceroById,
  getCruceroBySlug
} = require("./cruiseController");

const router = express.Router();
const cache = createResponseCache();

router.get("/", cache, listCruceros);
router.get("/slug/:slug", cache, getCruceroBySlug);
router.get("/:id", cache, getCruceroById);

module.exports = router;
