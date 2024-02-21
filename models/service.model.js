const { Schema, mongoose } = require("mongoose");

const ServiceSchema = new Schema({
  service_name: {
    type: String,
    required: true,
  },
  service_description: {
    type: String,
    required: true,
  },
  service_type: {
    type: String,
    enum: ["PD", "P", "BK", "I"],
    required: true,
  },
  service_status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    required: true,
  },
  service_code: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Service", ServiceSchema);
