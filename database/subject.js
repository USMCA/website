const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const subjectSchema = new Schema({
  name: { type: String, required: true },
});

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;
