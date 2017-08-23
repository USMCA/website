const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const notificationSchema = new Schema({
  admin_author: { type: Boolean, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Competition' },
  title: { type: String, required: true },
  body: { type: String, required: true },
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

notificationSchema.pre('validate', function(next) {
  const now = new Date();
  if (!this.created) this.created = now;
  if (!this.updated) this.updated = now;
  next();
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
