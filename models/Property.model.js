const { Schema, model } = require ('mongoose');

const propertySchema = new Schema(
    {
        name: String,
        location: String,
        m2: Number,
        img: [String],
        price: Number,
        business: {
            type: String,
            enum: ["sale', 'rent"],
            default: 'sale'
        },
        listedon: Number,
        amenities: [{
            type: String,
            enum: ['']
        }],
        updated: Number,
        owner: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    {
        timestamps: true
    }
)

const Property = model("Property", propertySchema);

module.exports = Property