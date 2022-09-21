const mongoose = require("mongoose");

const MomentSchema = new mongoose.Schema({
  momentType: {
    type: String,
    enum: ['photo', 'journal', 'location', 'twitter', 'ig'],
    required: false,
  },
  momentImage: {
    type: String,
    require: false,
  },
  cloudinaryId: {
    type: String,
    require: false,
  },
  location: {
    type: String,
    required: false,
  },
  tweetId: {
    type: String,
    required: false,
  },
  journalEntry: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: false,
  },
  time: {
    type: String,
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  timelineProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Timeline",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Moment", MomentSchema);
