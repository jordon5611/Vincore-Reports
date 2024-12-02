const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const UserSchema = new mongoose.Schema(
  {
    fname: {
      required: [true, "Please Enter Your First Name"],
      type: String,
    },
    lname: {
      required: [true, "Please Enter Your Last Name"],
      type: String,
    },
    email: {
      required: [true, "Please Enter Your Email"],
      type: String,
      unique: true,
    },
    password: {
      required: [true, "Please Enter Your Password"],
      type: String,
    },
    code: {
      type: Number,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    subscription: {
      type: Boolean,
      default: false
    },
    subscriptionStartDate: {
      type: Date
    },
    subscriptionEndDate: {  
      type: Date
    },
    stripeCustomerId: {
      type: String,
    },
    availableReports: {
      type: Number,
      default: 0
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.methods.getFullName = function () {
  return `${this.fname} ${this.lname}`;
};

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});


UserSchema.methods.createToken = function () {
  const token = jwt.sign(
    { userId: this._id, name: this.getFullName() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
  return token;
};

UserSchema.methods.createOTPToken = function () {
  const token = jwt.sign(
    { userId: this._id, name: this.getFullName() },
    process.env.JWT_SECRET,
    { expiresIn: "2m" }
  );
  return token;
};

UserSchema.methods.comparePassword = async function (reqPassword) {
  const isMatch = await bcrypt.compare(reqPassword, this.password);
  return isMatch;
};


module.exports = mongoose.model("User", UserSchema);
