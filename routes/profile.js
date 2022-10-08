const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const profileController = require("../controllers/profile");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, profileController.getPost);

router.get("/:profileId/following", profileController.getFollowing);

router.get("/:profileId/followers", profileController.getFollowers);

router.post("/createPost", upload.single("file"), profileController.createPost);

const cpUpload = upload.fields([{ name: 'pfp', maxCount: 1 }, { name: 'pfh', maxCount: 1 }])
router.put("/:userId/editProfile", cpUpload, profileController.editProfile);

router.put("/follow/:profileId", profileController.followUser);

router.put("/unfollow/:profileId", profileController.unfollowUser);

router.put("/likePost/:id", profileController.likePost);

router.delete("/deletePost/:id", profileController.deletePost);

module.exports = router;
