const express = require("express");
const { ofertasCache: cache } = require("../../lib/publicCaches");
const {
  listOfertas,
  getOfertaById,
  getOfertaBySlug,
  createOferta,
  updateOferta,
  deleteOferta
} = require("./offerController");

const router = express.Router();

router.get("/", cache, listOfertas);
router.get("/slug/:slug", cache, getOfertaBySlug);
router.get("/:id", cache, getOfertaById);
router.post("/", createOferta);
router.put("/:id", updateOferta);
router.delete("/:id", deleteOferta);

module.exports = router;
