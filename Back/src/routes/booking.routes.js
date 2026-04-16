const { Router } = require("express");
const { createBooking, getUserOrders, getAllOrders } = require("../controller/booking.controller");
const { verifyToken, verifyAdmin } = require("../middleware/auth.middleware");
const router = Router();

router.route("/create").post(verifyToken, createBooking);
router.route("/user/:id").get(verifyToken, getUserOrders);
router.route("/getall").get(verifyAdmin, getAllOrders);

module.exports = router;
