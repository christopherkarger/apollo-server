const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Events",
    },
  ],
});

module.exports = mongoose.model("User", eventSchema);
