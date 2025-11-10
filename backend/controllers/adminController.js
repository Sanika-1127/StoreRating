
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { User, Store, Rating, sequelize } = require("../models");

function validateUserInput({ name, address, password, email }) {
  const errors = [];
  if (name) {
    if (name.length < 20) errors.push("Name must be at least 20 characters.");
    if (name.length > 60) errors.push("Name must be at most 60 characters.");
  } else {
    errors.push("Name is required.");
  }

  if (address && address.length > 400) errors.push("Address must be at most 400 characters.");

  if (password) {
    if (password.length < 8 || password.length > 16) errors.push("Password must be 8-16 characters.");
    if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("Password must contain at least one special character.");
  } else {
    errors.push("Password is required.");
  }

  if (email) {
    // basic email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) errors.push("Email is not valid.");
  } else {
    errors.push("Email is required.");
  }

  return errors;
}


exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const allowedRoles = ["Admin", "Normal User", "Store Owner"];
    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({ message: `Role must be one of ${allowedRoles.join(", ")}` });
    }

    const errors = validateUserInput({ name, address, password, email });
    if (errors.length) return res.status(400).json({ errors });

    // check unique email
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already in use." });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, address, role });

    
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error("createUser:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !address)
      return res.status(400).json({ message: "Store name and address are required." });
    if (name.length < 1 || name.length > 60)
      return res.status(400).json({ message: "Store name length invalid." });
    if (address.length > 400)
      return res.status(400).json({ message: "Address too long." });

    let owner = null;

    // ✅ Check if ownerId is provided as email
    if (ownerId) {
      if (ownerId.includes("@")) {
        owner = await User.findOne({ where: { email: ownerId, role: "Store Owner" } });
        if (!owner) {
          return res.status(400).json({ message: "Store owner not found with this email." });
        }
      } else {
        // ✅ Otherwise, assume it’s a numeric ID
        owner = await User.findByPk(ownerId);
        if (!owner) {
          return res.status(400).json({ message: "Owner user not found by ID." });
        }
        if (owner.role !== "Store Owner") {
          return res.status(400).json({ message: "User is not a Store Owner." });
        }
      }
    }

    // ✅ Create the store
    const store = await Store.create({
      name,
      email,
      address,
      ownerId: owner ? owner.id : null,
    });

    res.status(201).json({
      message: "Store created successfully.",
      store,
    });
  } catch (err) {
    console.error("createStore:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.dashboard = async (req, res) => {
  try {
    const [usersCount, storesCount, ratingsCount] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);

    res.json({
      totalUsers: usersCount,
      totalStores: storesCount,
      totalRatings: ratingsCount,
    });
  } catch (err) {
    console.error("dashboard:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.listStores = async (req, res) => {
  try {
    const { name, email, address, minRating, sortBy = "name", order = "asc", page = 1, limit = 20 } = req.query;
    const offset = (Math.max(parseInt(page, 10), 1) - 1) * parseInt(limit, 10);

    
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
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
      offset,
      limit: parseInt(limit, 10),
      order: [[sortBy === "rating" ? sequelize.literal("averageRating") : sortBy, order.toUpperCase()]],
    });

    
    let result = stores.map((s) => s.get({ plain: true }));
    if (minRating) {
      result = result.filter((s) => {
        const avg = s.averageRating === null ? 0 : Number(s.averageRating);
        return avg >= Number(minRating);
      });
    }

    res.json({ data: result, count: result.length });
  } catch (err) {
    console.error("listStores:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.listUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = "name", order = "asc", page = 1, limit = 20 } = req.query;
    const offset = (Math.max(parseInt(page, 10), 1) - 1) * parseInt(limit, 10);

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      attributes: { exclude: ["password"] },
      offset,
      limit: parseInt(limit, 10),
      order: [[sortBy, order.toUpperCase()]],
    });

    res.json({ data: users, count: users.length });
  } catch (err) {
    console.error("listUsers:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getUserDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Store,
          include: [
            {
              model: Rating,
            },
          ],
        },
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found." });

    // If user is Store Owner, compute average ratings per store
    const userObj = user.get({ plain: true });

    if (userObj.role === "Store Owner" && userObj.Stores) {
      userObj.Stores = userObj.Stores.map((store) => {
        const ratings = store.Ratings || [];
        const avg = ratings.length ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length) : 0;
        return {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address,
          ownerId: store.ownerId,
          averageRating: Number(avg.toFixed(2)),
          ratings: ratings.map((r) => ({ id: r.id, userId: r.userId, rating: r.rating })),
        };
      });
    }

    res.json(userObj);
  } catch (err) {
    console.error("getUserDetails:", err);
    res.status(500).json({ error: err.message });
  }
};
