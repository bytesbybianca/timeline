const cloudinary = require("../middleware/cloudinary");
const Moment = require("../models/Moment");

module.exports = {
  editMoment: async (req, res) => {
    const moment = await Moment.findById(req.params.momentId);

    try {
      // update journal
      if(moment.momentType === 'journal') {
        await Moment.findOneAndUpdate(
          { _id: moment._id },
          {
            date: req.body.date,
            journalEntry: req.body.journal,
          }
        );     
      }
      // update location
      if(moment.momentType === 'location') {
        await Moment.findOneAndUpdate(
          { _id: moment._id },
          {
            date: req.body.date,
            location: req.body.location,
          }
        );     
      }
      // update photo
      if(moment.momentType === 'photo') {
        const result = await cloudinary.uploader.upload(req.file.path);
        const secure_url = result.secure_url;
        const public_id = result.public_id;

        await Moment.findOneAndUpdate(
          { _id: moment._id },
          {
            date: req.body.date,
            momentImage: result.secure_url,
            cloudinaryId: result.public_id,
          }
        );     
      }
      console.log("Moment updated");
      res.redirect(`/timelines/${moment.timelineProject}`);
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
