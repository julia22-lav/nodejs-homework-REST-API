const Contacts = require("../repositories/contacts");
const { HttpCode } = require("../helpers/constants");

const getAll = async (req, res, next) => {
  try {
    console.log(req.user);
    const userId = req.user.id;
    const { docs: contacts, ...rest } = await Contacts.listContacts(
      userId,
      req.query
    );
    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: { contacts, ...rest },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.getContactById(userId, req.params.contactId);
    if (contact) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        data: { contact },
      });
    }
    return res.json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.addContact(userId, req.body);
    if (
      contact?.name &&
      contact?.email &&
      contact?.phone &&
      contact?.favorite !== null
    ) {
      return res
        .status(201)
        .json({ status: "success", code: HttpCode.CREATED, data: { contact } });
    }
    return res.json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: "Missing required name field",
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(userId, req.params.contactId);
    if (contact) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        message: "Contact deleted",
      });
    }
    return res.json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!req.body) {
      return res.json({
        status: "error",
        code: HttpCode.BAD_REQUEST,
        message: "Missing fields",
      });
    }
    const contact = await Contacts.updateContact(
      userId,
      req.params.contactId,
      req.body
    );
    if (
      contact?.name &&
      contact?.email &&
      contact?.phone &&
      contact?.favorite !== null
    ) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        data: { contact },
      });
    }
    return res.json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!req.body) {
      return res.json({
        status: "error",
        code: HttpCode.BAD_REQUEST,
        message: "Missing field 'favorite'",
      });
    }
    const contact = await Contacts.updateContact(
      userId,
      req.params.contactId,
      req.body
    );
    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: { contact },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, remove, update, updateFavorite };