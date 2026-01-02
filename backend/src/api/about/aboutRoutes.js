const express = require("express");
const { createResponseCache } = require("../../middleware/responseCache");
const {
  listSecciones,
  getSeccionById,
  createSeccion,
  updateSeccion,
  deleteSeccion
} = require("./aboutController");

const router = express.Router();
const cache = createResponseCache();

router.get("/", cache, listSecciones);
router.get("/:id", cache, getSeccionById);
router.post("/", createSeccion);
router.put("/:id", updateSeccion);
router.delete("/:id", deleteSeccion);

module.exports = router;
