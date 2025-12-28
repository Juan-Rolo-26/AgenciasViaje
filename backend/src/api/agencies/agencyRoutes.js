const express = require("express");
const {
  getAgencies,
  getAgencyById
} = require("./agencyController");

const router = express.Router();

router.get("/", getAgencies);
router.get("/:id", getAgencyById);

module.exports = router;
