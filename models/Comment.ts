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
}, {
  timestamps: true,
});

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema); 