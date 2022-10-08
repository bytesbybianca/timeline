const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Timeline = require("../models/Timeline");
const Moment = require("../models/Moment");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const profile = await User.findById(req.params.userId)
      const posts = await Post.find({ user: req.user.id });
      const branchCount = await Timeline.countDocuments({ user: profile.id })
      const momentCount = await Moment.countDocuments({ user: profile.id })
      const timelines = await Timeline.find({ user: req.params.userId, privacy: "public" }).limit(4).sort({ firstDate: "asc" }).lean();
      const publicCount = await Timeline.countDocuments({ user: req.params.userId, privacy: "public" })


      let random, randomMoment, randomBranch

      console.log(randomMoment)
      
      if(momentCount > 0) {
        // Get a random number
        random = Math.floor(Math.random() * momentCount)
        // Query users' moments and fetch one offset by random #
        randomMoment = await Moment.findOne({ user: profile.id }).skip(random)
        randomBranch = await Timeline.findById( randomMoment.timelineProject )
      }

      console.log(randomMoment, randomBranch)

      res.render("profile.ejs", { posts: posts, profile: profile, branchCount: branchCount, momentCount: momentCount, timelines: timelines, publicCount: publicCount, randomMoment: randomMoment, randomBranch: randomBranch, user: req.user, url: req.url });
    } catch (err) {
      console.log(err);
    }
  },
  getFollowing: async (req, res) => {
    try {
      const profile = await User.findById(req.params.profileId)
      const following = await User.find({ _id: { "$in": profile.following } })

      res.render("following.ejs", { profile: profile, following: following, user: req.user, url: req.url });
    } catch (err) {
      console.log(err);
    }
  },
  getFollowers: async (req, res) => {
    try {
      const profile = await User.findById(req.params.profileId)
      const followers = await User.find({ _id: { "$in": profile.followers } })

      res.render("followers.ejs", { profile: profile, followers: followers, user: req.user, url: req.url });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("timelines.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  followUser: async (req, res) => {
    try {
      const user = req.user.id
      const profileToFollow = req.params.profileId

      console.log(user, profileToFollow)

      // add to user's following
      await User.findOneAndUpdate(
        { _id: user },
        { 
          $push: { following: profileToFollow }
        }
      );
      // add to profile followed users's followers
      await User.findOneAndUpdate(
        { _id: profileToFollow },
        { 
          $push: { followers: user }
        }
      );
      console.log(`Followed user ${req.params.profileId}`);
      res.redirect(`/profile/${req.params.profileId}`);
    } catch (err) {
      console.log(err);
    }
  },
  editProfile: async (req, res) => {
    try {
      // Find branch by id
      const userId = await User.findById(req.params.userId);

        // Delete branch image from cloudinary
      
      if(req.files['pfp']) {
        if(userId.pfp !== 'https://res.cloudinary.com/dc29mlsuv/image/upload/v1664650259/default-pfp_coyku4.svg') {
          console.log(userId.pfp)
          await cloudinary.uploader.destroy(userId.pfpId);
          console.log('deleted previous pfp!')
        } else {
          console.log('default pfp preserved')
        }

        const resultPfp = await cloudinary.uploader.upload(req.files['pfp'][0].path, { aspect_ratio: "1.0", height: 150, crop: "lfill" });
        await User.findOneAndUpdate(
          { _id: req.params.userId },
          {
            pfp: resultPfp.secure_url,
            pfpId: resultPfp.public_id,
          }
        ); 
      }

      if(req.files['pfh']) {
        if(userId.pfh !== 'https://res.cloudinary.com/dc29mlsuv/image/upload/v1664665436/default-header_on98cc.png') {
          await cloudinary.uploader.destroy(userId.pfhId);
        } else {
          console.log('default pfh preserved')
        }

        const resultPfh = await cloudinary.uploader.upload(req.files['pfh'][0].path);
        await User.findOneAndUpdate(
          { _id: req.params.userId },
          {
            pfh: resultPfh.secure_url,
            pfhId: resultPfh.public_id,
          }
        ); 
      }
      

      console.log(`Updated user profile ${req.params.userId}`);
      res.redirect(`/profile/${req.params.userId}`);
    } catch (err) {
      console.log(err);
    }
  },
  unfollowUser: async (req, res) => {
    try {
      const user = req.user.id
      const profileToUnfollow = req.params.profileId

      // remove from user's following
      await User.findOneAndUpdate(
        { _id: user },
        { 
          $pull: { following: profileToUnfollow }
        }
      );

      // remove from profile followed users' followers
      await User.findOneAndUpdate(
        { _id: profileToUnfollow },
        { 
          $pull: { followers: user }
        }
      );
      console.log(`Unfollowed user ${req.params.profileId}`);
      res.redirect(`/profile/${req.params.profileId}`);
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
