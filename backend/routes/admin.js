
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // role-based middleware
const adminController = require("../controllers/adminController");


router.use(auth(["Admin"]));

router.post("/users", adminController.createUser);

router.post("/stores", adminController.createStore);

router.get("/dashboard", adminController.dashboard);

router.get("/stores", adminController.listStores);

router.get("/users", adminController.listUsers);

router.get("/users/:id", adminController.getUserDetails);

module.exports = router;
