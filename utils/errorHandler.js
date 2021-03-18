const validationErrorHandler = (err, res) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const fields = Object.values(err.errors).map((el) => el.path);
  let code = 400;
  return errors.length > 1
    ? res.status(code).json({
        messages: errors.join(" "),
        fields,
      })
    : res.status(code).json({
        messages: errors,
        fields,
      });
};

const duplicateErrorHandler = (err, res) => {
  console.log(err, "duplicateerror");
  const field = err.index;
  const code = 409; // a http error status code for editing a unique resource on the server
  return res.status(code).json({
    messages: `An account with that ${field} is already exist`,
    fields: field,
  });
};

const centralErrorHandler = (err, req, res, next) => {
  if (err.name == "ValidationError") {
    return validationErrorHandler(err, res);
  }
  if (err.name == "JsonWebTokenError") {
    return res.status(500).json({
      message: err.message,
      error  : err.name 
    });
  }
  if (err.code && err.code == 11000) {
    return duplicateErrorHandler(err, res);
  }
  if(err.kind  && err.kind == "ObjectId") { 
    return res.status(500).json({
      message: "internal server error",
      error  : "invalid ObjectID"
    });
  }
  console.log(err);
  return res.status(500).json({
    message:err.message ,
    error : "internal server error"
  });
};

module.exports = centralErrorHandler;
