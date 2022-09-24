const cloudinary = require("../middleware/cloudinary");
const Moment = require("../models/Moment");

module.exports = {
  // getProfile: async (req, res) => {
  //   try {
  //     const posts = await Post.find({ user: req.user.id });
  //     res.render("profile.ejs", { posts: posts, user: req.user });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  // getTimelines: async (req, res) => {
  //   try {
  //     const timelines = await Timeline.find().sort({ createdAt: "desc" }).lean();
  //     res.render("timelines.ejs", { timelines: timelines });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  // getProject: async (req, res) => {
  //   try {
  //     const project = await Timeline.findById(req.params.projectId);
  //     res.render("project.ejs", { project: project, user: req.user });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  createMoment: async (req, res) => {
    try {
      // Upload image to cloudinary
      // const result = await cloudinary.uploader.upload(req.file.path);
      // const project = await Timeline.findById(req.params.projectId);
      
      await Moment.create({
        momentType: req.body.type,
        // momentImage: result.secure_url,
        // cloudinaryId: result.public_id,
        location: req.body.location,
        tweetId: req.body.tweetId,
        journalEntry: req.body.journal,
        date: req.body.date,
        time: req.body.time,
        user: req.user.id,
      });
      
      // console.log(req);
      console.log("A new moment has been created!");
      // TO-DO: REDIRECT TO PROJECT ID
      res.redirect("/timelines");
    } catch (err) {
      console.log(err);
    }
  },
  deleteMoment: async (req, res) => {
    try {
      // Find moment by id
      const moment = await Moment.findById(req.params.momentId);
      const branch = moment.timelineProject
      // Delete image from cloudinary
      if(moment.cloudinaryId) {
        await cloudinary.uploader.destroy(moment.cloudinaryId);
      }
      // Delete post from db
      await Moment.remove({ _id: req.params.momentId });
      console.log("Deleted Post");
      res.redirect("/timelines/"+branch);
    } catch (err) {
      res.redirect("/timelines/"+branch);
    }
  },
};
