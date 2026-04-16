const { Router } = require("express");
const { postCategory, getAllCategory, getCategoryByID, updateCategory, deleteCategory } = require("../controller/category.controller");
const upload = require("../middleware/multer.middleware");

const router = Router();

router.route("/postCategory").post(upload.single("catImg"), postCategory);
router.route("/getCategory").get(getAllCategory);
router.route("/getCategory/:id").get(getCategoryByID);
router.route("/updateCategory/:id").put(upload.single("catImg"), updateCategory);
router.route("/deleteCategory/:id").delete(deleteCategory);

module.exports = router;
