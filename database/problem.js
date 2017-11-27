const mongoose = require('mongoose'),
      _ = require('lodash'),
      Schema = mongoose.Schema,
      { difficultyEnum } = require('../constants');

const problemSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  competition: { type: Schema.Types.ObjectId, ref: 'Competition' },
  publicDatabase: { type: Boolean, required: true, default: false },
  borrowed: { type: Boolean, required: true, default: false },
  statement: { type: String, required: true },
  answer: String,
  soln: { type: Schema.Types.ObjectId, ref: 'Solution' },
  official_soln: [ { type: Schema.Types.ObjectId, ref: 'Solution' } ],
  alternate_soln: [ { type: Schema.Types.ObjectId, ref: 'Solution' } ],
  subject: { type: String, required: true },
  difficulty: { type: Number, min: 1, max: 5 },
  upvotes: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
  comments: [ { type: Schema.Types.ObjectId, ref: 'Comment' } ],
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

problemSchema.pre('validate', function(next) {
  if (this.difficulty) {
    if (this.difficulty > 5) this.difficulty = 5;
    if (this.difficulty < 1) this.difficulty = 1;
    this.difficulty = Math.round(this.difficulty);
  }

  const now = new Date();
  if (!this.created) this.created = now;
  if (!this.updated) this.updated = now;
  next();
});

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;
