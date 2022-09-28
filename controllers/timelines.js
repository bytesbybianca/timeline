const cloudinary = require("../middleware/cloudinary");
const Timeline = require("../models/Timeline");
const Moment = require("../models/Moment");

module.exports = {
  getTimelines: async (req, res) => {
    try {
      // Find branches by user, sorted by firstDate in ascending order
      const timelines = await Timeline.find({ user: req.user.id }).sort({ firstDate: "asc" }).lean();

      // branchByYear object to be grouped by year for ejs
      let branchByYear = {}
      for(key in timelines) {
        let branchYear
        if(timelines[key].firstDate == null) {
          branchYear = Number('0')
        } else if(timelines[key].firstDate) {
          branchYear = timelines[key].firstDate.toLocaleString('en-US', { year: 'numeric' })
        }
          // if branch year is in object, add to array
          if(branchYear in branchByYear) {
            branchByYear[branchYear].push(timelines[key])
          } else if(!(branchYear in branchByYear)) {
            // if not, create array
            branchByYear[branchYear] = []
            branchByYear[branchYear].push(timelines[key])
          }
        }
      console.log(branchByYear)
      res.render("timelines.ejs", { timelines: timelines, user: req.user, branchByYear: branchByYear, url: req.url });
    } catch (err) {
      console.log(err);
    }
  },
  getProject: async (req, res) => {
    try {
      const project = await Timeline.findById(req.params.projectId);
      console.log(`🌸 🌸 project ${project.id} 🌸 🌸`)
      const moments = await Moment.find({ timelineProject: project.id }).sort({ date: "asc" })
      
      const test = await Moment.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
              day: { $dayOfMonth: "$date" },
            },
          }
        },
        { $sort: {_id: 1} },
      ]);

      console.log(test)

      res.render("branch.ejs", { project: project, moments: moments, user: req.user, url: req.url });
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
        description: req.body.description,
        timelineThumb: result.secure_url,
        cloudinaryId: result.public_id,
        firstDate: req.body.firstDate, 
        lastDate: req.body.lastDate, 
        user: req.user.id,
      });
      
      console.log("A new timeline has been created!");
      // console.log(req);
      res.redirect("/timelines");
    } catch (err) {
      console.log(err);
    }
  },
  deleteBranch: async (req, res) => {
    try {
      // Find branch by id
      const project = await Timeline.findById(req.params.projectId);
      // Delete branch image from cloudinary
      await cloudinary.uploader.destroy(project.cloudinaryId);

      const moments = await Moment.find({ timelineProject: project.id }).lean();

      // Loop through moments in branch to delete all moment images from cloudinary
      for(let i = 0; i < moments.length; i++) {
        if(moments[i].cloudinaryId) {
          await cloudinary.uploader.destroy(moments[i].cloudinaryId);
        }
      }

      // Delete branch from Timeline
      await Timeline.remove({ _id: req.params.projectId });
      // Delete all moments in branch
      await Moment.remove({ timelineProject: req.params.projectId });
      console.log("Deleted branch");
      res.redirect("/timelines");
    } catch (err) {
      res.redirect("/timelines");
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

      // sorts moments by project id and asending dates
      const moments = await Moment.find({ timelineProject: project.id }).sort({ date: "asc" }).lean();

      // update first and last branch date with each new moment
      await Timeline.findOneAndUpdate({ _id: project.id },{
        firstDate: moments[0].date, 
        lastDate: moments[moments.length -1].date, 
      })
      
      // console.log(req);
      console.log("🌸 🌸 A new moment has been created! 🌸 🌸");
      res.redirect(`/timelines/${project.id}`);
      console.log(`🌸 🌸 Successfully redirected to /timelines/${project.id} 🌸 🌸`);
    } catch (err) {
      console.log(err);
    }
  },
};
