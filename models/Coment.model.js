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
    }
},
{
    timestamps: true
});

const Comment = model("Comment", commentSchema);

module.exports = Comment;
