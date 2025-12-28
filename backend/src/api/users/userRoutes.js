const express = require("express");
const { listUsers, signup, login } = require("./userController");

const router = express.Router();

router.get("/", listUsers);
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
