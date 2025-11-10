const Store = require("../models/store");
const Rating = require("../models/rating");
const User = require("../models/user");

// List stores with average rating
exports.listStores = async (req, res) => {
  try {
    const stores = await Store.find()
      .populate({
        path: "ratings",
        populate: { path: "userId", select: "name email" },
      })
      .lean();

    // Add average rating to each store
    const result = stores.map((store) => {
      const ratings = store.ratings || [];
      const avg =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      return { ...store, averageRating: Number(avg.toFixed(2)) };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Rate a store
exports.rateStore = async (req, res) => {
  try {
    const { rating } = req.body;
    const storeId = req.params.id;
    const userId = req.user.id; // from JWT

    console.log("🔍 Incoming rating:", { userId, storeId, rating }); // ✅ Add this

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found." });
    }

    let existing = await Rating.findOne({ userId, storeId });

    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.json({ message: "Rating updated", rating: existing });
    }

    const newRating = await Rating.create({ rating, userId, storeId });

    store.ratings.push(newRating._id);
    await store.save();

    res.json({ message: "Rating submitted", rating: newRating });
  } catch (err) {
    console.error("❌ RateStore Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// Store Owner Dashboard
exports.ownerDashboard = async (req, res) => {
  try {
    const ownerEmail = req.user.email;

    const owner = await User.findOne({ email: ownerEmail });
    if (!owner) return res.status(404).json({ message: "Owner not found." });

    const stores = await Store.find({ ownerId: owner._id })
      .populate({
        path: "ratings",
        populate: { path: "userId", select: "name email" },
      })
      .lean();

    if (!stores.length) {
      return res.json({ message: "No store found for this owner." });
    }

    const result = stores.map((store) => {
      const ratings = store.ratings || [];
      const avg =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      return {
        id: store._id,
        name: store.name,
        address: store.address,
        averageRating: Number(avg.toFixed(2)),
        ratings: ratings.map((r) => ({
          id: r._id,
          rating: r.rating,
          user: r.userId,
        })),
      };
    });

    res.json(result);
  } catch (err) {
    console.error("ownerDashboard:", err);
    res.status(500).json({ error: err.message });
  }
};
