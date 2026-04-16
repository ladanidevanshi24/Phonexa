const { Router } = require("express");
const { register, login, updateUser, userGet, getUserById } = require("../controller/user.controller");
const { verifyToken, verifyAdmin } = require("../middleware/auth.middleware");
const router = Router();


router.route("/register").post(register);
router.route('/login').post(login)
router.route('/update/:id').patch(verifyToken, updateUser)
router.route('/getalluser').get(verifyAdmin, userGet)
router.route('/getuserbyid/:id').get(verifyToken, getUserById)


module.exports = router;