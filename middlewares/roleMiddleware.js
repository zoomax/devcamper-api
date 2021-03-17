exports.roleMiddleware = function (...roles) {
  return (req, res, next) => {
    const { user } = req;
    if (!roles.includes(user.role))
      next(
        new Error(
          `user with ${user.role} is not authorized to aaccess this route`
        )
      );
    next();
  };
};
