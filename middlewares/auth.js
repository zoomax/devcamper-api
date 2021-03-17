const UserModel = require("../db/models/user");
const jwt = require("jsonwebtoken");

const authMiddleware = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  console.log(authHeader, "from auth middleware");
  let token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : "";
  console.log(token.trim());
  try {
    const payload =
      token !== "" ? jwt.verify(token, process.env.JWT_SECRET) : null;
    console.log(token);
    const user = payload ? await UserModel.findById(payload.id) : null;
    if (user) {
      console.log(user, "from auth middleware");
      req.user = user;
      return next();
    }
    return next(new Error("acccess denide , you're not authorized"));
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
