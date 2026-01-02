const express = require("express");
const { createResponseCache } = require("../../middleware/responseCache");
const {
  listDestinos,
  getDestinoById,
  getDestinoBySlug,
  createDestino,
  updateDestino,
  deleteDestino
} = require("./destinationController");

const router = express.Router();
const cache = createResponseCache();

router.get("/", cache, listDestinos);
router.get("/slug/:slug", cache, getDestinoBySlug);
router.get("/:id", cache, getDestinoById);
router.post("/", createDestino);
router.put("/:id", updateDestino);
router.delete("/:id", deleteDestino);

module.exports = router;
