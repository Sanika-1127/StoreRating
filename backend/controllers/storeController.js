const { Store, Rating, User, sequelize } = require("../models");

// List stores with average rating
exports.listStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [
        { model: Rating, include: [{ model: User, attributes: ["id", "name", "email"] }] },
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT ROUND(AVG(rating),2) FROM Ratings WHERE Ratings.storeId = Store.id
            )`),
            "averageRating",
          ],
        ],
      },
    });

    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Rate a store
exports.rateStore = async (req, res) => {
  try {
    const { rating } = req.body;
    const storeId = req.params.id;
    const userId = req.user.id; 

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    let existing = await Rating.findOne({ where: { userId, storeId } });
    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.json({ message: "Rating updated", rating: existing });
    }

    const newRating = await Rating.create({ rating, userId, storeId });
    res.json({ message: "Rating submitted", rating: newRating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Store Owner Dashboard
exports.ownerDashboard = async (req, res) => {
  try {
    const ownerEmail = req.user.email; 

    const stores = await Store.findAll({
      where: { email: ownerEmail }, 
      include: [
        {
          model: Rating,
          include: [{ model: User, attributes: ["id", "name", "email"] }],
        },
      ],
    });

    if (!stores.length) {
      return res.json({ message: "No store found for this owner." });
    }

    const result = stores.map((store) => {
      const ratings = store.Ratings || [];
      const avg =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating: Number(avg.toFixed(2)),
        ratings: ratings.map((r) => ({
          id: r.id,
          rating: r.rating,
          user: r.User, 
        })),
      };
    });

    res.json(result);
  } catch (err) {
    console.error("ownerDashboard:", err);
    res.status(500).json({ error: err.message });
  }
};
