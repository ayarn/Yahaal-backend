const { Schema, mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const VendorSchema = new Schema({
  vendor_name: {
    type: String,
    required: true,
  },
  vendor_email: {
    type: String,
    required: true,
  },
  password: {
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
  },
});

VendorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hashedPassword = await bcrypt.hash(
    this.password,
    Number(process.env.BCRYPT_SALT)
  );

  this.password = hashedPassword;
  next();
});

module.exports = mongoose.model("Vendor", VendorSchema);
