const Users = require("../repositories/users");
const { HttpCode } = require("../helpers/constants");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require("fs/promises");
const path = require("path");
const SECRET_KEY = process.env.SECRET_KEY;
const UploadAvatarService = require("../services/local-upload");

const getCurrent = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }

    const { email, subscription, avatarURL } = user;
    return res.json({
      status: "success",
      code: HttpCode.OK,
      user: { email, subscription, avatarURL },
    });
  } catch (err) {
    next(err);
  }
};

const signup = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email is already used",
      });
    }
    const { id, email, subscription, avatarURL } = await Users.create(req.body);
    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: { id, email, subscription, avatarURL },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }
    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(id, token);
    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!req.body) {
      return res.json({
        status: "error",
        code: HttpCode.BAD_REQUEST,
        message: "Missing field 'subscription'",
      });
    }
    
    const { subscription } = await Users.update(userId, req.body);
    return res.json({
      status: "success",
      code: HttpCode.OK,
      user: { subscription },
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }
    const id = req.user.id;
    const uploads = new UploadAvatarService(process.env.AVATAR_OF_USERS);
    const avatarUrl = await uploads.saveAvatar({ userId: id, file: req.file });
    try {
      await fs.unlink(path.join(process.env.AVATAR_OF_USERS, req.user.avatar));
    } catch (err) {
      console.log(err.message);
    }
    await Users.updateAvatar(id, avatarUrl);
    res.json({
      status: "success",
      code: HttpCode.OK,
      data: { avatarUrl },
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { signup, login, logout, updateSubscription, getCurrent, updateAvatar };