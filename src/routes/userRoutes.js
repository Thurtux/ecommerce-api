const express = require("express");
const { getUser, updateUser, deleteUser } = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:uid", authenticateToken, getUser);
router.put("/:uid", authenticateToken, updateUser);
router.delete("/:uid", authenticateToken, deleteUser);

module.exports = router;
