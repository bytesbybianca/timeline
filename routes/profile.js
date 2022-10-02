const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const profileController = require("../controllers/profile");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, profileController.getPost);

router.get("/:profileId/following", profileController.getFollowing);

router.post("/createPost", upload.single("file"), profileController.createPost);

router.put("/follow/:profileId", profileController.followUser);

router.put("/unfollow/:profileId", profileController.unfollowUser);

router.put("/likePost/:id", profileController.likePost);

router.delete("/deletePost/:id", profileController.deletePost);

module.exports = router;
