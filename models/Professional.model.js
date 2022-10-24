const { Schema, model } = require("mongoose");

const professionalSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    cif: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    passwordConfirmation: {
      type: String,
    },
    phone: Number,
    img: String,
    properties: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin", "moderators"],
      default: "user"
    }
  },
  {
    timestamps: true,
  }
);

const Professional = model("Professional", professionalSchema);

module.exports = Professional;
