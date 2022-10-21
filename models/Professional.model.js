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
    phone: Number,
    img: String,
    properties: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Professional = model("Professional", professionalSchema);

module.exports = Professional;