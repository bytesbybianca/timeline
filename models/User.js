const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  pfp: {
    type: String,
    default: "https://res.cloudinary.com/dc29mlsuv/image/upload/v1664650259/default-pfp_coyku4.svg",
  },
  pfpId: {
    type: String,
    default: "",
  },
  pfh: {
    type: String,
    default: "https://res.cloudinary.com/dc29mlsuv/image/upload/v1664665436/default-header_on98cc.png",
  },
  pfhId: {
    type: String,
    default: "",
  },
  about: {
    type: String,
    default: "",
  },
  displayName: {
    type: String,
    default: "",
  },
  followers: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
});

// Password hash middleware.

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
