const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const momentsController = require("../controllers/moments");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now

router.delete("/:momentId/deleteMoment", momentsController.deleteMoment);

router.put("/:momentId/editMoment", upload.single("file"), momentsController.editMoment);

module.exports = router;