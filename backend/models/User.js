const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userID: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  Name: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  EmailID: { type: String, required: true },
  Balance: { type: Number, required: true },
  TransactionHistory: [
    {
      type: {
        recipient: String,
        amount: Number,
        date: { type: Date },
      },
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
