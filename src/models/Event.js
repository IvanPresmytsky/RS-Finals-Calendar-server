const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  text: { type: String, trim: true },
  date: { type: Date, required: true },
  startTime: { type: Date },
  endTime: { type: Date }
});

module.exports = eventSchema;
