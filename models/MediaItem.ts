import mongoose from 'mongoose';

const mediaItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  cover_url: {
    type: String,
  },
  content_type: {
    type: String,
    enum: ['anime', 'movie', 'series', 'game', 'album'],
    required: true,
  },
  status: {
    type: String,
    enum: ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch', 'recommendation'],
    required: true,
  },
  date_added: {
    type: Date,
    default: Date.now,
  },
  platform: {
    type: String,
  },
  personal_score: {
    type: Number,
    min: 0,
    max: 10,
  },
  notes: {
    type: String,
  },
  recommended_by: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.MediaItem || mongoose.model('MediaItem', mediaItemSchema); 