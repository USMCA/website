const mongoose = require('mongoose'),
      _ = require('lodash'),
      Schema = mongoose.Schema,
      { requestEnum, userTypeEnum } = require('../constants');

const requestSchema = new Schema({
  body: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: _.values(requestEnum) },
  competition: { type: Schema.Types.ObjectId, ref: 'Competition' },
  user_type: { type: String, enum: _.values(userTypeEnum) },
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

requestSchema.pre('validate', function(next) {
  const now = new Date();
  if (!this.created) this.created = now;
  if (!this.updated) this.updated = now;
  next();
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
