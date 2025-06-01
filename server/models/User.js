const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],
    savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],

});

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10); // 10 = salt rounds
    next();
  } catch (err) {
    next(err);
  }
});

// Compare entered password to hashed one
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);