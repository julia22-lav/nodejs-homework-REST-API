const Contact = require("../model/contact");

const listContacts = async (userId, query) => {
  const {
    sortBy,
    sortByDesc,
    filter,
    favorite = null,
    limit = 5,
    offset,
  } = query;
  const optionsSearch = { owner: userId };
  if (favorite !== null) {
    optionsSearch.favorite = favorite;
  }
  const results = Contact.paginate(optionsSearch, {
    limit,
    offset,
    filter,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    select: filter ? filter.split("|").join(" ") : "",
    populate: {
      path: "owner",
      select: "email subscription",
    },
  });
  return results;
};

const getContactById = async (userId, contactId) => {
  return await Contact.findOne({ _id: contactId, owner: userId }).populate({
    path: "owner",
    select: "email subscription",
  });
};

const removeContact = async (userId, contactId) => {
  return await Contact.findOneAndRemove({ _id: contactId, owner: userId });
};

const addContact = async (userId, body) => {
  return await Contact.create({ ...body, owner: userId });
};

const updateContact = async (userId, contactId, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true }
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};