const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const solutionSchema = new Schema({
  body: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: [ { type: Schema.Types.ObjectId, ref: 'Comment' } ],
  difficulty: { type: Number, min: 1, max: 5 },
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

solutionSchema.pre('validate', function(next) {
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

const Solution = mongoose.model('Solution', solutionSchema);
module.exports = Solution;
