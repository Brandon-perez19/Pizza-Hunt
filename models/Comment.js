const {Schema, model, Types} = require('mongoose');
const dateFormat = require('../utils/dateFormat')

const ReplySchema = new Schema(
    {
        //set custome id to avoid confusion with parent comment _id
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String,
            required: true,
            trim: true
        },
        writtenBy: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dateFormat(createdAtVal)
        }
    },
    {
        toJSON:{
            getters: true
        },
    }
)

const CommentSchema = new Schema({
    writtenBy: {
        type: String,
        required: true,
        trim: true
    },
    commentBody: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    replies: [ReplySchema]
},
{
    toJSON:{
        virtuals: true,
        getters: true
    },
    
    id: false
});

//gets the number of replies on a pizza
CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;