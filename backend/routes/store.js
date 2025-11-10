const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { listStores, rateStore, ownerDashboard } = require("../controllers/storeController");


router.get("/", listStores);

router.post("/:id/rate", auth(["Normal User"]), rateStore);

router.get("/owner/dashboard", auth(["Store Owner"]), ownerDashboard);

module.exports = router;
