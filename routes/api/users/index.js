const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");

const {
  signupUserValidation,
  resendVerifyEmailValidation,
  updateUserSubscriptionValidation,
  loginUserValidation,
} = require("./validation");

router.get("/current", guard, ctrl.getCurrent);

router.post("/signup", signupUserValidation, ctrl.signup);
router.post("/login", loginUserValidation, ctrl.login);
router.post("/logout", guard, ctrl.logout);

router.get("/verify/:verifyToken", ctrl.verify);
router.post("/verify", resendVerifyEmailValidation, ctrl.resendVerifyEmail);

router.patch(
  "/subscription",
  guard,
  updateUserSubscriptionValidation,
  ctrl.updateSubscription
);

router.patch("/avatars", guard, upload.single("avatar"), ctrl.updateAvatar);

module.exports = router;