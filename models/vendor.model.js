const { Schema, mongoose } = require("mongoose");

const VendorSchema = new Schema({
  vendor_name: {
    type: String,
    required: true,
  },
  vendor_email: {
    type: String,
    required: true,
  },
  vendor_contact: {
    type: Number,
    required: true,
  },
  instagram_account: {
    type: String,
  },
  is_approved: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Vendor", VendorSchema);
