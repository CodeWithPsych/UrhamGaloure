import mongoose from "mongoose";
const { Schema } = mongoose;

const deletedOrderSchema = new Schema({
  items: { type: [Schema.Types.Mixed], required: true },
  totalAmount: { type: Number },
  totalItems: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: "pending" },
  selectedAddress: { type: [Schema.Types.Mixed], required: true },
  date: { type: String },
});

const virtual = deletedOrderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

deletedOrderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export default mongoose.model("DeletedOrder", deletedOrderSchema);
