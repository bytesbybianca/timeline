const mongoose = require("mongoose");

const TimelineSchema = new mongoose.Schema({
  timelineName: {
    type: String,
    required: true,
  },
  timelineThumb: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  firstDate: {
    type: Date,
    require: true,
  },
  lastDate: {
    type: Date,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Timeline", TimelineSchema);
