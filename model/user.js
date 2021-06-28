const { Schema, model } = require("mongoose");
const gr = require("gravatar");
const { Subscription } = require("../helpers/constants");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 8;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate(value) {
      const re = /\S+@\S+\.\S+/g;
      return re.test(String(value).toLowerCase());
    },
  },
  subscription: {
    type: String,
    enum: Object.values(Subscription),
    default: Subscription.STARTER,
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default: function () {
      return gr.url(this.email, { s: "250" }, true);
    },
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model("user", userSchema);

module.exports = User;