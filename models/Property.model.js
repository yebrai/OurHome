const { Schema, model } = require("mongoose");

const propertySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    location: String,
    m2: Number,
    img: [String],
    price: {
      type: String,
      trim: true,
      required: true,
    },
    amenities: [String],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    professional: [
      {
        type: Schema.Types.ObjectId,
        ref: "Professional",
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Property = model("Property", propertySchema);

module.exports = Property;
