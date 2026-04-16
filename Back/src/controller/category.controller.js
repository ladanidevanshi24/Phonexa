const  Category = require('../model/category.model')
const mongoose = require('mongoose');
const uploadOnCloudinary = require('../utils/cloudinary');

const postCategory = async (req,res)=>{
    try {
        const { categoryName } = req.body;
        if (!categoryName) {
            return res.json({
                success: 0,
                message: "Category name is required"
            });
        }

        const localFilePath = req.file?.path;
        if (!localFilePath) {
            return res.json({
                success: 0,
                message: "Category image is required"
            });
        }

        const catImg = await uploadOnCloudinary(localFilePath);
        
        if (!catImg || !catImg.url) {
            return res.json({
                success: false,
                message: "Error while uploading on cloudinary",
            });
        }

        await Category.create({ categoryName, catImg: catImg.url });

        return res.json({
            success: 1,
            message: "Category Added Successfully"
        });
    } catch (error) {
        return res.json({
            success : 0,
            message : "Error in code",
            error :  error.message
        })
    }
}

const getAllCategory = async (req,res) =>{
    try {
        const  getCategory = await Category.find({})
        if (!getCategory) {
            return res.json({
                success : 0 ,
                message : "Get Category Data."

            })
        } else {
            return res.json({
                success : 1 ,
                message : "Get Category Data.",
                data : getCategory
            })
        }
    } catch (error) {
        return res.json({
            success : 0 ,
            message : "Error in code",
            error : error.message
        })
    }
}

const getCategoryByID = async (req, res) => {
  try {
    const id = req.params.id;
    const getCategory = await Category.find({ _id: id });
    if (!getCategory) {
      return res.json({
        success: 0,
        message: "Get Category Data.",
      });
    } else {
      return res.json({
        success: 1,
        message: "Get Category Data.",
        data: getCategory,
      });
    }
  } catch (error) {
    return res.json({
      success: 0,
      message: "Error in code",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { categoryName } = req.body;
    let updateData = { categoryName };

    if (req.file) {
      const localFilePath = req.file.path;
      const catImg = await uploadOnCloudinary(localFilePath);
      if (catImg && catImg.url) {
        updateData.catImg = catImg.url;
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCategory) {
      return res.json({
        success: 0,
        message: "Category not found",
      });
    }

    return res.json({
      success: 1,
      message: "Category Updated Successfully",
      data: updatedCategory,
    });
  } catch (error) {
    return res.json({
      success: 0,
      message: "Error in code",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.json({
        success: 0,
        message: "Category not found",
      });
    }

    return res.json({
      success: 1,
      message: "Category Deleted Successfully",
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
  postCategory,
  getAllCategory,
  getCategoryByID,
  updateCategory,
  deleteCategory,
};