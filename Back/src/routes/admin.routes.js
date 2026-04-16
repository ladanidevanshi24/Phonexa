const { Router } = require("express");
const { adminLogin, getAdminById, updateAdmin } = require("../controller/admin.controller");
const { verifyAdmin } = require("../middleware/auth.middleware");

const router = Router();

router.route("/login").post(adminLogin);
router.route("/getadmin/:id").get(verifyAdmin, getAdminById);
router.route("/update/:id").patch(verifyAdmin, updateAdmin);

module.exports = router;
