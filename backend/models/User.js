const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
  profile: {
    location: { type: String, default: '' },
    farmSize: { type: Number, default: 0 }, // in acres
    cropTypes: [{ type: String }],
    language: { type: String, default: 'en' }
  }
}, { timestamps: true });

// Quick method to format user object safely
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', UserSchema);