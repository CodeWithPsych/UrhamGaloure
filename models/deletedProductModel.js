import mongoose from "mongoose";
const { Schema } = mongoose;

const DeletedProductSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  rating: {
    type: Number,
    min: [0, "Wrong Minimum Rating"],
    max: [5, "Wrong Maximum Rating"],
    default: 0,
    required: false,
  },
  price: {
    type: Number,
    min: [1, "Wrong Minimum Price"],
    required: true,
  },
  discountPercentage: {
    type: Number,
    min: [1, "Wrong Minimum discountPercentage"],
    max: [99, "Wrong Maximum discountPercentage"],
    required: false,
    default: 0,
  }
});

const virtual = DeletedProductSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
DeletedProductSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export default mongoose.model("DeletedProduct", DeletedProductSchema);
