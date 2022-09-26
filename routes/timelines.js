const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const timelinesController = require("../controllers/timelines");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:projectId", timelinesController.getProject);

router.post("/createTimeline", upload.single("file"), timelinesController.createTimeline);

router.post("/:projectId/createMoment", upload.single("file"), timelinesController.createMoment);

router.delete("/deleteBranch/:projectId", timelinesController.deleteBranch);

module.exports = router;