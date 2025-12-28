const express = require("express");
const {
  listDestinos,
  getDestinoById,
  getDestinoBySlug,
  createDestino,
  updateDestino,
  deleteDestino
} = require("./destinationController");

const router = express.Router();

router.get("/", listDestinos);
router.get("/slug/:slug", getDestinoBySlug);
router.get("/:id", getDestinoById);
router.post("/", createDestino);
router.put("/:id", updateDestino);
router.delete("/:id", deleteDestino);

module.exports = router;
