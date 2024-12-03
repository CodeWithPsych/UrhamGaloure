import mongoose from "mongoose";
const { Schema } = mongoose;

const BrandSchema = new Schema({
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

const virtual = BrandSchema.virtual('id');
virtual.get(function () {
  return this._id;
});
BrandSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export default mongoose.model("Brand", BrandSchema);