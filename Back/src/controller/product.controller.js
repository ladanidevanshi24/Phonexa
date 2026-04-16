const Product = require("../model/product.model");
const mongoose = require("mongoose");
const uploadOnCloudinary = require("../utils/cloudinary");

//Post Product
const postProduct = async (req, res) => {
  try {
    const { productName, price, description, categoryId } = req.body;
    
    if (!productName || !price || !description || !categoryId) {
        return res.json({
            success: 0,
            message: "All fields (productName, price, description, categoryId) are required"
        });
    }

    const localFilePath = req.file?.path;
    if (!localFilePath) {
        return res.json({
            success: 0,
            message: "Product image is required"
        });
    }

    const porductImg = await uploadOnCloudinary(localFilePath);

    if (!porductImg || !porductImg.url) {
        return res.json({
            success: false,
            message: "Error while uploading image to cloudinary",
        });
    }

    await Product.create({
        productName,
        price,
        description,
        categoryId,
        porductImg: porductImg.url,
    });

    return res.json({
        success: 1,
        message: "Product Added Successfully",
    });
  } catch (error) {
    return res.json({
      success: 0,
      message: "Error in code",
      error: error.message,
    });
  }
};

//Get All Product
const getAllProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const totalCount = await Product.countDocuments();
    const getallProduct = await Product.find({})
      .populate("categoryId") // Adding populate for better data on management page
      .skip(skip)
      .limit(limit);

    if (!getallProduct) {
      return res.json({
        success: 0,
        message: "Product not found.",
      });
    } else {
      return res.json({
        success: 1,
        message: "Get All Product.",
        data: getallProduct,
        pagination: {
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          itemsPerPage: limit,
        },
      });
    }
  } catch (error) {
    return res.json({
      success: 0,
      message: "Error in the code",
      error: error.message,
    });
  }
};

//Get Product By ID
const getProductByid = async (req, res) => {
  try {
    const id = req.params.id;
    const getProduct = await Product.find({ _id: id }).populate("categoryId");
    if (!getProduct) {
      return res.json({
        success: 0,
        message: " Product not found.",
      });
    } else {
      return res.json({
        success: 1,
        message: "Get Product.",
        data: getProduct,
      });
    }
  } catch (error) {
    return res.json({
      success: 0,
      message: "Error in the code",
      error: error.message,
    });
  }
};

//All Product get by Category ID
const catidGetproduct = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const findData = await Product.find({ categoryId: categoryId }).populate(
      "categoryId"
    );
    if (!findData) {
      return res.json({
        success: 0,
        message: "Data not found",
      });
    } else {
      return res.json({
        success: 1,
        message: "Data  found",
        data: findData,
      });
    }
  } catch (error) {
    return res.json({
      success: 0,
      message: "Error in the code",
    });
  }
};

//get product by search
const searchproduct = async (req, res) => {
  try {
    const productName = req.query.name;
    const products = await Product.find({
      productName: { $regex: productName, $options: "i" },
    });

    return res.json({
      success: 1,
      message: "Data  found",
      data: products,
    });
  } catch (error) {
    return res.json({
      success: 0,
      message: "Error in the code",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { productName, price, description, categoryId } = req.body;
    let updateData = { productName, price, description, categoryId };

    if (req.file) {
      const localFilePath = req.file.path;
      const porductImg = await uploadOnCloudinary(localFilePath);
      if (porductImg && porductImg.url) {
        updateData.porductImg = porductImg.url;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.json({
        success: 0,
        message: "Product not found",
      });
    }

    return res.json({
      success: 1,
      message: "Product Updated Successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return res.json({
      success: 0,
      message: "Error in code",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.json({
        success: 0,
        message: "Product not found",
      });
    }

    return res.json({
      success: 1,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    return res.json({
      success: 0,
      message: "Error in code",
      error: error.message,
    });
  }
};

module.exports = {
  postProduct,
  getAllProduct,
  getProductByid,
  catidGetproduct,
  searchproduct,
  updateProduct,
  deleteProduct,
};
