const advancedResponse = (model, populate = "") => async (req, res, next) => {
  let queryCopy = { ...req.query };
  let { select, sort, limit, page } = req.query;
  let selectionString = select ? select.split(",").join(" ") : "";
  let sortString = sort ? sort.split(",").join(" ") : "";
  let fields = ["sort", "select", "limit", "page"];
  let currentPage = page ? parseInt(page, 10) : 1;
  let currentPageLimit = limit ? parseInt(limit, 10) : 25;
  let skippedItems = (currentPage - 1) * currentPageLimit;
  fields.forEach((param) => delete queryCopy[param]);
  let stringifiedQuery = JSON.stringify(queryCopy);
  let query = stringifiedQuery.replace(
    /\b(in|gte|gt|lt|lte)\b/g,
    (match) => `$${match}`
  );
  try {
    const total = await model.countDocuments();
    let results = await model
      .find(JSON.parse(query))
      .select(selectionString)
      .sort(sortString)
      .skip(skippedItems)
      .limit(currentPageLimit)
      .populate(populate, "name description");
    console.log(results);
    req.response = {
      statusCode: 200,
      data: results.length ? results : [],
      pagination: {
        next:
          skippedItems < total
            ? {
                page: currentPage + 1,
                limit: currentPageLimit,
              }
            : undefined,
        prev:
          skippedItems > 0
            ? {
                page: currentPage - 1,
                limit: currentPageLimit,
              }
            : undefined,
      },
    };

    next();
  } catch (err) {
    next(err);
  }
};
module.exports = advancedResponse;
