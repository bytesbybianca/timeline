const cloudinary = require("../middleware/cloudinary");
const Timeline = require("../models/Timeline");
const Moment = require("../models/Moment");
const mongoose = require("mongoose");
const User = require("../models/User");

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

      const timelinesGrouped = await Timeline.aggregate([
        { $match : { user: mongoose.Types.ObjectId(req.user.id) } },
        {
          $group: {
            _id: {
              year: { $year: "$firstDate" },
              // month: { $month: "$firstDate" },
            },
            branchData:
              { $addToSet: 
                { 
                  branchId: "$_id", 
                  timelineName: "$timelineName", 
                  description: "$description", 
                  timelineThumb: "$timelineThumb", 
                  cloudinaryId: "$cloudinaryId", 
                  firstDate: "$firstDate", 
                  lastDate: "$lastDate", 
                  privacy: "$privacy", 
                  user: "$user", 
                  createdAt: "$createdAt"
                }
             },
          }
        },
        { $sort: {_id: 1} },
      ])

      // console.log(branchByYear)
      console.log(timelinesGrouped)
      res.render("timelines-v4.ejs", { timelinesGrouped: timelinesGrouped, timelines: timelines, user: req.user, branchByYear: branchByYear, url: req.url });
    } catch (err) {
      console.log(err);
    }
  },
  getProject: async (req, res) => {
    try {
      const project = await Timeline.findById(req.params.projectId);
      console.log(`🌸 🌸 project ${project.id} 🌸 🌸`)
      // console.log(Moment.length)
      const moments = await Moment.find({ timelineProject: project.id }).sort({ date: "asc" })
      // const momentDate = moments[0].date
      // console.log(momentDate)
      const momentsGrouped = await Moment.aggregate([
        { $match : { timelineProject: mongoose.Types.ObjectId(req.params.projectId) } },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
            },
            momentData:
              { $addToSet: 
                { 
                  momentId: "$_id", 
                  momentType: "$momentType", 
                  momentImage: "$momentImage", 
                  location: "$location", 
                  tweetId: "$tweetId", 
                  journalEntry: "$journalEntry", 
                  caption: "$caption", 
                  date: "$date", 
                  user: "$user", 
                  timelineProject: "$timelineProject", 
                  createdAt: "$createdAt", 
                }
             },
          }
        },
        { $sort: {_id: 1} },
      ])

      const branchCreator = await User.findById(project.user)

      console.log(branchCreator)

      res.render("branch.ejs", { project: project, moments: moments, user: req.user, url: req.url, momentsGrouped: momentsGrouped, branchCreator: branchCreator });
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
        privacy: req.body.privacy, 
        user: req.user.id,
      });
      
      console.log("A new timeline has been created!");
      // console.log(req);
      res.redirect("/timelines");
    } catch (err) {
      console.log(err);
    }
  },
  editBranch: async (req, res) => {
    try {

      // Find branch by id
      const branch = await Timeline.findById(req.params.branchId);

      if(req.file) {
        // Delete branch image from cloudinary
        await cloudinary.uploader.destroy(branch.cloudinaryId);

        const result = await cloudinary.uploader.upload(req.file.path);
        await Timeline.findOneAndUpdate(
          { _id: req.params.branchId },
          {
            timelineThumb: result.secure_url,
            cloudinaryId: result.public_id,
          }
        ); 
      } 
      
      await Timeline.findOneAndUpdate(
        { _id: req.params.branchId },
        {
          timelineName: req.body.timelineName,
          privacy: req.body.privacy,
          description: req.body.description,
        }
      );     

    
      console.log("Branch updated");
      res.redirect(`/timelines/${req.params.branchId}`);
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
        caption: req.body.caption,
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
