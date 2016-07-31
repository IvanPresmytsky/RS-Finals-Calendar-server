const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  text: { type: String, trim: true },
  date: { type: String, required: true },
  startTime: { type: String },
  endTime: { type: String }
});

module.exports = eventSchema;
