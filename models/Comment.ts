import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  mediaItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MediaItem',
    required: true,
  },
  name: {
    type: String,
    maxlength: 100,
  },
  text: {
    type: String,
    required: true,
    maxlength: 500,
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  likedIps: [{
    type: String,
    default: [],
  }],
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema); 