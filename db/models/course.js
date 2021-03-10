const { Schema, model } = require("mongoose");

const CourseSchema = new Schema({
  title: {
    type: String,
    required: [true, "course title field is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: [true, "course description field is required"],
  },
  tuition: {
    type: Number,
    required: [true, "course tuition field is required"],
  },
  scholarhipsAvailable: {
    type: Boolean,
    required: [true, "cuorse scholarshipAvailable field is required "],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  minimumSkill: {
    type: String,
    trim: true,
    required: [true, "course minimumSkills field is required "],
    enum: ["beginner", "intermediate", "advanced"],
  },
  weeks: {
    type: Number,
    required: [true, "course weeks field is required"],
  },
  bootcamp: {
    type: Schema.ObjectId,
    ref: "bootcamp",
    required: true,
  },
});

CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log("avarage bootcamp cost is being calculated.....".blue);
  try {
    const averageCostAggregationArray = await this.aggregate([
      {
        $match: {
          bootcamp: bootcampId,
        },
      },

      {
        $group: {
          _id: "$bootcamp",
          avarageCost: { $avg: "$tuition" },
        },
      },
    ]);
    await this.model("bootcamp").findByIdAndUpdate(bootcampId, {
      avarageCost:
        Math.ceil(averageCostAggregationArray[0].avarageCost / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});
CourseSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = model("course", CourseSchema);
