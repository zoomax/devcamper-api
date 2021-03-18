// const uniqueValidator = require("mongoose-unique-validator");
const { Schema, model } = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../../utils/geocoder");

const BootcampSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      maxength: [50, "name must be at most 50 letters"],
      required: [true, "name is required"],
      trim: true,
    },
    photo: {
      type: String,
      trim: true,
    },
    slug: String,
    description: {
      type: String,
      maxlength: [500, "description must be at most 500 letters"],
      trim: true,
      required: [true, "description is required"],
    },
    address: {
      type: String,
      required: [true, "this field is required"],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "please add a valid website",
      ],
      required: [true, "website is required"],
    },
    email: {
      type: String,
      match: [
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
        "please add a valid email",
      ],
      required: [true, "email is required"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      state: String,
      zipcode: String,
      city: String,
      country: String,
    },
    careers: [
      {
        type: String,
        required: [true, "careers is required"],
        enum: [
          // is a set of values the this field's value must be one of them
          "Web Development",
          "Mobile Development",
          "UI/UX",
          "Data Science",
          "Business",
          "Other",
        ],
      },
    ],
    avarageRating: {
      type: Number,
      min: [1, "rating must be at least 1"],
      // any field property has a value either a single value or a tuple with both value and an error message
      max: [10, "rating must be at most 10"],
    },
    avarageCost: Number,
    photo: {
      type: String,
      default: "no-img.png",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssitance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
BootcampSchema.virtual("courses", {
  foreignField: "bootcamp",
  localField: "_id",
  ref: "course",
  justOne: false,
});
BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
BootcampSchema.pre("save", async function (next) {
  try {
    const loc = await geocoder.geocode(this.address);
    this.location = {
      type: "Point",
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
      city: loc[0].city,
      country: loc[0].country,
      state: loc[0].state,
      street: loc[0].streetName,
      zipCode: loc[0].zipcode,
    };
    this.address = this.location.formattedAddress;
    next();
  } catch (err) {
    console.log(err);
  }
});
module.exports = model("bootcamp", BootcampSchema);
