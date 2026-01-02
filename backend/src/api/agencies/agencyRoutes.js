const express = require("express");
const { createResponseCache } = require("../../middleware/responseCache");
const {
  getAgencies,
  getAgencyById
} = require("./agencyController");

const router = express.Router();
const cache = createResponseCache();

router.get("/", cache, getAgencies);
router.get("/:id", cache, getAgencyById);

module.exports = router;
