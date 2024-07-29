const User = require("../models/User");

exports.registerUser = async (email, avatar) => {
  const user = new User({ email, avatar, lastActive: new Date() });
  await user.save();
  return user;
};

exports.getUsers = async () => {
  return await User.find();
};
