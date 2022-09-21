const cloudinary = require("../middleware/cloudinary");
const Timeline = require("../models/Timeline");
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
  getTimelines: async (req, res) => {
    try {
      const timelines = await Timeline.find({ user: req.user.id }).sort({ createdAt: "desc" }).lean();
      res.render("timelines.ejs", { timelines: timelines });
    } catch (err) {
      console.log(err);
    }
  },
  getProject: async (req, res) => {
    try {
      const project = await Timeline.findById(req.params.projectId);
      console.log(`🌸 🌸 project ${project.id} 🌸 🌸`)
      const moments = await Moment.find({ timelineProject: project.id })
      console.log(`🌸 🌸 ${moments}  🌸 🌸`)
      res.render("project.ejs", { project: project, moments: moments, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createTimeline: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Timeline.create({
        timelineName: req.body.title,
        timelineThumb: result.secure_url,
        cloudinaryId: result.public_id,
        user: req.user.id,
      });
      
      console.log("A new timeline has been created!");
      console.log(req);
      res.redirect("/timelines");
    } catch (err) {
      console.log(err);
    }
  },
  createMoment: async (req, res) => {
    try {
      // Upload image to cloudinary
      let result, secure_url, public_id
      // redefine variables for cloudinary use if user is uploading a photo
      if(req.body.momentType === 'photo') {
        result = await cloudinary.uploader.upload(req.file.path);
        secure_url = result.secure_url;
        public_id = result.public_id
      }
      const project = await Timeline.findById(req.params.projectId);
      
      await Moment.create({
        momentType: req.body.momentType,
        momentImage: secure_url,
        cloudinaryId: public_id,
        location: req.body.location,
        tweetId: req.body.tweetId,
        journalEntry: req.body.journal,
        date: req.body.date,
        time: req.body.time,
        user: req.user.id,
        timelineProject: req.body.timelineProject,
      });
      
      console.log(req);
      console.log("🌸 🌸 A new moment has been created! 🌸 🌸");
      res.redirect(`/timelines/${project.id}`);
      console.log(`🌸 🌸 Successfully redirected to /timelines/${project.id} 🌸 🌸`);
    } catch (err) {
      console.log(err);
    }
  },
};
