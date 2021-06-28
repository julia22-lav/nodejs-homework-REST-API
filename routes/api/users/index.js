const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");

const {
  signupUserValidation,
  updateUserSubscriptionValidation,
  loginUserValidation,
} = require("./validation");

router.get("/current", guard, ctrl.getCurrent);

router.post("/signup", signupUserValidation, ctrl.signup);
router.post("/login", loginUserValidation, ctrl.login);
router.post("/logout", guard, ctrl.logout);

router.patch(
  "/subscription",
  guard,
  updateUserSubscriptionValidation,
  ctrl.updateSubscription
);

module.exports = router;