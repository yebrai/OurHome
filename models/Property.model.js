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
      enum: ["sale", "rent"],
      default: "sale",
    },
    style: {
      type: String,
      enum: ['garaje', 'chalet', 'apart'],
      default: "apart",
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
