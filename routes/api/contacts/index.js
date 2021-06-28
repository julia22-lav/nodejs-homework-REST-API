const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/contacts");
const guard = require("../../../helpers/guard");

const {
  createContactValidation,
  updateContactValidation,
  updateContactFavoriteValidation,
} = require("./validation");

router
  .get("/", guard, ctrl.getAll)
  .post("/", guard, createContactValidation, ctrl.create);

router
  .get("/:contactId", guard, ctrl.getById)
  .delete("/:contactId", guard, ctrl.remove)
  .put("/:contactId", guard, updateContactValidation, ctrl.update);

router.patch(
  "/:contactId/favorite",
  guard,
  updateContactFavoriteValidation,
  ctrl.updateFavorite
);

module.exports = router;