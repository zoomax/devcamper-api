const mongoose = require("mongoose");

const connectDB = async () => {
  console.log(process.env.MONGO_URI);
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
      autoIndex: true,
    });
    console.log("DB Connected".cyan.underline.bold);
  } catch (error) {
    console.log(`${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
