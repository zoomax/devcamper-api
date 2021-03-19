const UserModel = require("../db/models/user");

exports.getUserById = async function (req, res, next) {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    req.response = {
      data: user ? [user] : [],
      statusCode: user ? 200 : 404,
    };
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.getUsers = async function (req, res, next) {
  try {
    next();
  } catch (err) {
    return next(err);
  }
};

exports.createUser = async function (req, res, next) {
  const {
    body: { name, email, role, password },
  } = req;
  try {
    const user = new UserModel({ name, email, role, password });
    await user.save();
    req.response = {
      data: user
        ? [{ ...user.toJSON(), message: "user was created successfully" }]
        : [],
      statusCode: user ? 201 : 400,
    };
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.updateUser = async function (req, res, next) {
  const {
    body,
    params: { id },
  } = req;
  console.log(id, "from deleteUser auth function".green);
  try {
    const user = await UserModel.findByIdAndUpdate(id, body, { new: true });
    console.log(user);
    req.response = {
      data: user
        ? [{ ...user.toJSON(), message: "user was updated successfully" }]
        : [],
      statusCode: user ? 203 : 404,
    };
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.deleteUser = async function (req, res, next) {
  const {
    params: { id },
  } = req;
  try {
    const user = await UserModel.findByIdAndDelete(id);

    req.response = {
      data: user
        ? [{ ...user.toJSON(), message: "user was deleted successfully" }]
        : [],
      statusCode: user ? 202 : 404,
    };
    return next();
  } catch (err) {
    return next(err);
  }
};
