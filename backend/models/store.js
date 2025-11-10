const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 60,
    },
    email: {
      type: String,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    address: {
      type: String,
      required: true,
      maxlength: 400,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
    },

    // ✅ Add this ratings array field
    ratings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating",
      },
    ],
  },
  { timestamps: true }
);

// (Optional) Virtual populate for ratings
StoreSchema.virtual("ratingsList", {
  ref: "Rating",
  localField: "_id",
  foreignField: "storeId",
});

StoreSchema.set("toObject", { virtuals: true });
StoreSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Store", StoreSchema);
