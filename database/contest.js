const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const contestSchema = new Schema({
  competition: { type: Schema.Types.ObjectId, ref: 'Competition', required: true },
  locations: [ {
    site: { type: String, required: true },
    address: String
  } ],
  active: { type: Boolean, required: true, default: false },
  name: { type: String, required: true },
  date: Date,
  test_solve_deadline: Date,
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
