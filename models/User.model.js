const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: false,
      unique: true
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    passwordConfirmation: {
      type: String,
    },
    phone: {
      type: Number,
      required: true
    },
    img: {
      type: String
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderators"],
      default: "user"
    },
    properties:[{}]
  },
      {
    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
