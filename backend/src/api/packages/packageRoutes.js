const express = require("express");
const { createResponseCache } = require("../../middleware/responseCache");
const {
  getPackages,
  getPackageById
} = require("./packageController");

const router = express.Router();
const cache = createResponseCache();

router.get("/", cache, getPackages);
router.get("/:id", cache, getPackageById);

module.exports = router;
