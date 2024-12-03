import mongoose from "mongoose";
const { Schema } = mongoose;

const CategorySchema = new Schema({
  value: {
    type: String,
  },
  label: {
    type: String,
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

const virtual = CategorySchema.virtual('id');
virtual.get(function () {
  return this._id;
});
CategorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export default mongoose.model("Category", CategorySchema);