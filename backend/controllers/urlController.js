const Url = require("../models/Url");
const validator = require("validator");
const generateShortCode = require("../utils/generateShortCode");
const Visit = require("../models/Visit");

const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        message: "URL is required",
      });
    }

    if (!validator.isURL(originalUrl)) {
      return res.status(400).json({
        message: "Please enter a valid URL",
      });
    }

    const shortCode = generateShortCode();

    const url = await Url.create({
      user: req.user._id,
      originalUrl,
      shortCode,
    });

    res.status(201).json({
      success: true,
      url,
      shortUrl: `http://localhost:5000/${shortCode}`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getUserUrls = async (req, res) => {
    try {
      const urls = await Url.find({
        user: req.user._id,
      }).sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        count: urls.length,
        urls,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  const deleteUrl = async (req, res) => {
    try {
      const url = await Url.findOne({
        _id: req.params.id,
        user: req.user._id,
      });
  
      if (!url) {
        return res.status(404).json({
          message: "URL not found",
        });
      }
  
      await url.deleteOne();
  
      res.status(200).json({
        success: true,
        message: "URL deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  const redirectUrl = async (req, res) => {
    try {
      const { shortCode } = req.params;
  
      const url = await Url.findOne({ shortCode });
  
      if (!url) {
        return res.status(404).json({
          message: "Short URL not found",
        });
      }
  
      url.clickCount += 1;
      url.lastVisited = new Date();
  
      await url.save();
  
      await Visit.create({
        url: url._id,
      });
  
      return res.redirect(url.originalUrl);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  const getUrlAnalytics = async (req, res) => {
    try {
      const url = await Url.findOne({
        _id: req.params.id,
        user: req.user._id,
      });
  
      if (!url) {
        return res.status(404).json({
          message: "URL not found",
        });
      }
  
      const visits = await Visit.find({
        url: url._id,
      })
        .sort({ visitedAt: -1 })
        .limit(20);
  
      res.status(200).json({
        success: true,
        totalClicks: url.clickCount,
        lastVisited: url.lastVisited,
        recentVisits: visits,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

module.exports = {
  createShortUrl,
  getUserUrls,
  deleteUrl,
  redirectUrl,
  getUrlAnalytics,
};