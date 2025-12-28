const express = require("express");
const {
  listOfertas,
  getOfertaById,
  getOfertaBySlug,
  createOferta,
  updateOferta,
  deleteOferta
} = require("./offerController");

const router = express.Router();

router.get("/", listOfertas);
router.get("/slug/:slug", getOfertaBySlug);
router.get("/:id", getOfertaById);
router.post("/", createOferta);
router.put("/:id", updateOferta);
router.delete("/:id", deleteOferta);

module.exports = router;
