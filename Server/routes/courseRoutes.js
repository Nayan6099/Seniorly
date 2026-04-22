const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { status, category, level, isFree } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (level) query.level = level;
    if (isFree !== undefined) query.isFree = isFree === 'true';

    const courses = await Course.find(query).populate('instructor', 'firstName lastName avatar');
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses'
    });
  }
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'firstName lastName avatar bio');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course'
    });
  }
});

module.exports = router;
