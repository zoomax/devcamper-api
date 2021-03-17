const { response } = require("./utils");
const responseHandler = (req, res) => {
  const { data, statusCode, pagination} = req.response;
  // console.log(data, statusCode, "from the response handler");
  switch (statusCode) {
    case 200:
      return res.status(statusCode).json({
        ...response,
        statusCode,
        data: data.length > 0 ? data : [],
        status: "OK",
        count: data.length,
        pagination: pagination ? pagination : undefined,
      });
    case 203:
      return res.status(statusCode).json({
        ...response,
        statusCode,
        data: data.length > 0 ? data : [],
        status: "Updated",
        count: data.length,
      });
    case 202:
      return res.status(statusCode).json({
        ...response,
        statusCode,
        data: data.length > 0 ? data : [],
        status: "Deleted",
        count: data.length,
      });
    case 201:
      return res.status(statusCode).json({
        ...response,
        statusCode,
        data: data.length > 0 ? data : [],
        status: "Created",
        count: data.length,
      });
    case 401:
      return res.status(statusCode).json({
        ...response,
        statusCode,
        status: "Unauthorized",
      });
    case 404:
    default:
      return res.status(404).json({
        ...response,
        statusCode: 404,
        status: "Not Found",
      });
  }
};

module.exports = responseHandler;
