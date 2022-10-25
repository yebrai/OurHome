const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
    content: {
        type: String,
        trim: true,
        required: true,
      },
    postedOn: String,
    like: {
        type: Number,
        default: 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    
},
{
    timestamps: true
});

const Comment = model("Comment", commentSchema);

module.exports = Comment;
