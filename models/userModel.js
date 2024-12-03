import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: Buffer, required: true },
  role: { type: String, required: true, default: "user" },
  addresses: { type: [Schema.Types.Mixed] },
  name: { type: String },
  orders: { type: [Schema.Types.Mixed] },
  salt: Buffer,
  resetPasswordToken:{type:String,default:''}
});

const virtual = UserSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export default mongoose.model("User", UserSchema);
