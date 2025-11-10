const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 60,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 100,
    },
    address: {
      type: String,
      maxlength: 400,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Normal User", "Store Owner"],
      default: "Normal User",
    },
  },
  { timestamps: true }
);

// Relationships (virtuals)
UserSchema.virtual("stores", {
  ref: "Store",
  localField: "_id",
  foreignField: "ownerId",
});

UserSchema.virtual("ratings", {
  ref: "Rating",
  localField: "_id",
  foreignField: "userId",
});

// Enable virtuals in JSON output
UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
