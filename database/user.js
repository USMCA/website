const bcrypt = require('bcrypt'),
      mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  university: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true, default: false },
  secure: { type: Boolean, required: true, default: false },
  salt: { type: String, required: true },
  unread: [ { type: Schema.Types.ObjectId, ref: 'Notification' } ],
  read: [ { type: Schema.Types.ObjectId, ref: 'Notification' } ],
  urgent: [ { type: Schema.Types.ObjectId, ref: 'Notification' } ],
  requests: [ { type: Schema.Types.ObjectId, ref: 'Request' } ],
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

userSchema.methods.checkPassword = function(password, callback) {
  let user = this;
  bcrypt.hash(password, user.salt, (err, hash) => {
    if (err) return callback(err, null);
    else return callback(null, { authenticated: user.password === hash });
  });
};

userSchema.pre('validate', function(next) {
  let user = this;

  /* set created and/or updated */
  const now = new Date();
  if (!user.created) user.created = now;
  user.updated = now;
  
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);
    user.salt = salt;
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      /* replace cleartext password with hash */
      user.password = hash;
      return next();
    });
  });
});

const User = mongoose.model('User', userSchema);
module.exports = User;
