const express = require("express");

const { createShortUrl, getUserUrls, deleteUrl,getUrlAnalytics} = require("../controllers/urlController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createShortUrl);
router.get("/all", protect, getUserUrls);
router.delete("/:id", protect, deleteUrl);
router.get("/analytics/:id", protect, getUrlAnalytics);
module.exports = router;