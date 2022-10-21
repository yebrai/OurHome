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
      type: Number,
      trim: true,
      required: true,
    },
    apartmentFor: {
      type: String,
      enum: ["sale', 'rent"],
      default: "sale",
    },
    listedBy: {
      type: String,
      enum: ["user', 'professional"],
      default: "user",
    },
    postedOn: Number,
    amenities: [
      {
        type: String,
        enum: ["Security", "Balcony", "Central A/C & Heating"],
      },
    ],
    updated: Number,
    owner: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Property = model("Property", propertySchema);

module.exports = Property;
