const express = require("express");
const { createResponseCache } = require("../../middleware/responseCache");
const {
  listOfertas,
  getOfertaById,
  getOfertaBySlug,
  createOferta,
  updateOferta,
  deleteOferta
} = require("./offerController");

const router = express.Router();
const cache = createResponseCache();

router.get("/", cache, listOfertas);
router.get("/slug/:slug", cache, getOfertaBySlug);
router.get("/:id", cache, getOfertaById);
router.post("/", createOferta);
router.put("/:id", updateOferta);
router.delete("/:id", deleteOferta);

module.exports = router;
