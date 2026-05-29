import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  apiKey: { type: String, default: null },
});

const User = mongoose.model("users", userSchema);

export default User;
