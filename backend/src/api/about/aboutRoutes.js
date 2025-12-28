const express = require("express");
const {
  listSecciones,
  getSeccionById,
  createSeccion,
  updateSeccion,
  deleteSeccion
} = require("./aboutController");

const router = express.Router();

router.get("/", listSecciones);
router.get("/:id", getSeccionById);
router.post("/", createSeccion);
router.put("/:id", updateSeccion);
router.delete("/:id", deleteSeccion);

module.exports = router;
