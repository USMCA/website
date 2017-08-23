const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const testSchema = new Schema({
  name: { type: String, required: true },
  contest: { type: Schema.Types.ObjectId, ref: 'Contest', required: true },
  num_problems: { type: Number, required: true },
  problems: [ { type: Schema.Types.ObjectId, ref: 'Problem' } ],
  created: { type: Date, required: true },
  updated: { type: Date, required: true },
});

testSchema.pre('validate', function(next) {
  const now = new Date();
  if (!this.created) this.created = now;
  if (!this.updated) this.updated = now;
  next();
});

const Test = mongoose.model('Test', testSchema);
module.exports = Test;
