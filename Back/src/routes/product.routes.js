const { Router } = require("express");
const upload = require("../middleware/multer.middleware");
const { postProduct, getAllProduct, getProductByid, catidGetproduct, searchproduct, updateProduct, deleteProduct } = require("../controller/product.controller");

const router = Router();

router.route("/postProduct").post(upload.single("porductImg"), postProduct);
router.route("/getallproduct").get(getAllProduct);
router.route("/getproduct/:id").get(getProductByid);
router.route("/getproductByCategory/:id").get(catidGetproduct);
router.route("/search").get(searchproduct);
router.route("/updateProduct/:id").put(upload.single("porductImg"), updateProduct);
router.route("/deleteProduct/:id").delete(deleteProduct);


module.exports = router;
