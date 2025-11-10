const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");

// ✅ Validate User Input
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
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
      errors.push("Password must contain at least one special character.");
  } else {
    errors.push("Password is required.");
  }

  if (email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) errors.push("Email is not valid.");
  } else {
    errors.push("Email is required.");
  }

  return errors;
}

// ✅ Create User
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const allowedRoles = ["Admin", "Normal User", "Store Owner"];

    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({ message: `Role must be one of ${allowedRoles.join(", ")}` });
    }

    const errors = validateUserInput({ name, address, password, email });
    if (errors.length) return res.status(400).json({ errors });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use." });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, address, role });

    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error("createUser:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create Store
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

    if (ownerId) {
      if (ownerId.includes("@")) {
        owner = await User.findOne({ email: ownerId, role: "Store Owner" });
        if (!owner) return res.status(400).json({ message: "Store owner not found with this email." });
      } else {
        owner = await User.findById(ownerId);
        if (!owner) return res.status(400).json({ message: "Owner user not found by ID." });
        if (owner.role !== "Store Owner")
          return res.status(400).json({ message: "User is not a Store Owner." });
      }
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId: owner ? owner._id : null,
    });

    res.status(201).json({ message: "Store created successfully.", store });
  } catch (err) {
    console.error("createStore:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Dashboard Counts
exports.dashboard = async (req, res) => {
  try {
    const [usersCount, storesCount, ratingsCount] = await Promise.all([
      User.countDocuments(),
      Store.countDocuments(),
      Rating.countDocuments(),
    ]);

    res.json({ totalUsers: usersCount, totalStores: storesCount, totalRatings: ratingsCount });
  } catch (err) {
    console.error("dashboard:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ List Stores with Filter and Avg Rating
exports.listStores = async (req, res) => {
  try {
    const { name, email, address, minRating, sortBy = "name", order = "asc", page = 1, limit = 20 } = req.query;
    const skip = (Math.max(parseInt(page, 10), 1) - 1) * parseInt(limit, 10);

    const query = {};
    if (name) query.name = { $regex: name, $options: "i" };
    if (email) query.email = { $regex: email, $options: "i" };
    if (address) query.address = { $regex: address, $options: "i" };

    let stores = await Store.find(query).skip(skip).limit(parseInt(limit, 10));

    stores = await Promise.all(
      stores.map(async (store) => {
        const ratings = await Rating.find({ storeId: store._id });
        const avgRating = ratings.length
          ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(2)
          : 0;
        return { ...store.toObject(), averageRating: Number(avgRating) };
      })
    );

    if (minRating) {
      stores = stores.filter((s) => s.averageRating >= Number(minRating));
    }

    const sorted = stores.sort((a, b) => {
      if (sortBy === "rating") {
        return order === "asc" ? a.averageRating - b.averageRating : b.averageRating - a.averageRating;
      }
      return order === "asc"
        ? a[sortBy].localeCompare(b[sortBy])
        : b[sortBy].localeCompare(a[sortBy]);
    });

    res.json({ data: sorted, count: sorted.length });
  } catch (err) {
    console.error("listStores:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ List Users
exports.listUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = "name", order = "asc", page = 1, limit = 20 } = req.query;
    const skip = (Math.max(parseInt(page, 10), 1) - 1) * parseInt(limit, 10);

    const query = {};
    if (name) query.name = { $regex: name, $options: "i" };
    if (email) query.email = { $regex: email, $options: "i" };
    if (address) query.address = { $regex: address, $options: "i" };
    if (role) query.role = role;

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(parseInt(limit, 10))
      .sort({ [sortBy]: order === "asc" ? 1 : -1 });

    res.json({ data: users, count: users.length });
  } catch (err) {
    console.error("listUsers:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get User Details
exports.getUserDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password").lean();

    if (!user) return res.status(404).json({ message: "User not found." });

    const stores = await Store.find({ ownerId: user._id });
    for (let store of stores) {
      const ratings = await Rating.find({ storeId: store._id });
      const avg = ratings.length ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length) : 0;
      store = store.toObject();
      store.averageRating = Number(avg.toFixed(2));
      store.ratings = ratings.map((r) => ({ id: r._id, userId: r.userId, rating: r.rating }));
    }

    if (user.role === "Store Owner") user.Stores = stores;
    res.json(user);
  } catch (err) {
    console.error("getUserDetails:", err);
    res.status(500).json({ error: err.message });
  }
};
