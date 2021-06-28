const User = require("../model/user");

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const create = async (body) => {
  const user = new User(body);
  return await user.save();
};

const tryVerify = async (verifyToken) => {
  return await User.findOneAndUpdate(
    { verifyToken },
    { isVerified: true, verifyToken: null }
  );
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const update = async (id, body) => {
  const result = await User.findOneAndUpdate(
    { _id: id },
    { ...body },
    { new: true }
  );
  return result;
};

const updateAvatar = async (id, avatar) => {
  return await User.updateOne({ _id: id }, { avatar });
};

module.exports = { findById, findByEmail, create, tryVerify, updateToken, update, updateAvatar};