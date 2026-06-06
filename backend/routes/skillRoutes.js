const express = require("express");
const router = express.Router();

const { analyzeSkillGapAI } = require("../controllers/skillController");
const {authMiddleware} =require('../middlewares/auth.middleware')
router.post("/analyze-ai/:id",authMiddleware ,analyzeSkillGapAI);

module.exports = router;