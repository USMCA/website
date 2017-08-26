const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const contestSchema = new Schema({
  competition: { type: Schema.Types.ObjectId, ref: 'Competition' },
  locations: [ {
    site: { type: String, required: true },
    address: String
  } ],
  name: { type: String, required: true },
  date: { type: Date, required: true },
  tests: [ { type: Schema.Types.ObjectId, ref: 'Test' } ],
  test_solvers: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
  czars: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
  created: { type: Date, required: true },
  updated: { type: Date, required: true },
});

contestSchema.pre('validate', function(next) {
  const now = new Date();
  if (!this.created) this.created = now;
  if (!this.updated) this.updated = now;
  next();
});

const Contest = mongoose.model('Contest', contestSchema);
module.exports = Contest;
