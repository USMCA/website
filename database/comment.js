const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const commentSchema = new Schema({
  body: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  issue; { type; Boolean, required: true, default: false },
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

commentSchema.pre('validate', function(next) {
  const now = new Date();
  if (!this.created) this.created = now;
  if (!this.updated) this.updated = now;
  next();
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
