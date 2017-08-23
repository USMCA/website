const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const competitionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  short_name: { type: String, required: true },
  website: String,
  active_contests: [ { type: Schema.Types.ObjectId, ref: 'Contest' } ],
  contests: [ { type: Schema.Types.ObjectId, ref: 'Contest' } ],
  directors: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
  members: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
  announcements: [ { type: Schema.Types.ObjectId, ref: 'Announcement' } ],
  valid: { type: Boolean, required: true, default: false },
  created: { type: Date, required: true },
  updated: { type: Date, required: true },
});

competitionSchema.pre('validate', function(next) {
  if (this.shortName) {
    this.short_name = this.shortName;
  }
  if (!this.short_name) {
    this.short_name = this.name;
  }

  const now = new Date();
  if (!this.created) this.created = now;
  if (!this.updated) this.updated = now;
  next();
});

const Competition = mongoose.model('Competition', competitionSchema);
module.exports = Competition;
