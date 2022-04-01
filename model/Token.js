const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  valid: {
    type: Boolean,
    required: true,
  },
});

const Token = mongoose.model("Token", TokenSchema);

module.exports = Token;
