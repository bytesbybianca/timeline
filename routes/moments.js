const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const momentsController = require("../controllers/moments");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
// router.get("/:projectId", timelinesController.getProject);

// router.post("/createTimeline", upload.single("file"), timelinesController.createTimeline);

router.post("/createMoment", upload.single("file"), momentsController.createMoment);

router.delete("/:momentId/deleteMoment", momentsController.deleteMoment);

module.exports = router;