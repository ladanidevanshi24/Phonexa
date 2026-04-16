const user = require("../model/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "phonex_secret_key";

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    const existUser = await user.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        success: 0,
        message: "Email already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new user({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    if (!savedUser) {
      return res.status(500).json({
        success: 0,
        message: "User registration failed.",
      });
    }

    return res.status(201).json({
      success: 1,
      message: "User registered successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: 0,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFind = await user.findOne({ email });

    if (!userFind) {
      return res.status(404).json({
        success: 0,
        message: "Email not found.",
      });
    }

    const isMatch = await bcrypt.compare(password, userFind.password);
    if (!isMatch) {
      // Fallback for plain text password during transition period
      if (password === userFind.password) {
        // Correct, but we should hash it now or just warn
      } else {
        return res.status(401).json({
          success: 0,
          message: "Invalid credentials.",
        });
      }
    }

    const token = jwt.sign(
      { id: userFind._id, email: userFind.email, role: "user" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: 1,
      message: "Login successful.",
      token,
      data: {
        _id: userFind._id,
        firstName: userFind.firstName,
        lastName: userFind.lastName,
        email: userFind.email,
        role: "user"
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: 0,
      message: "Server error during login",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    // Using findByIdAndUpdate with { new: true } to get the updated document
    const updatedUser = await user.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedUser) {
      return res.json({
        success: 0,
        message: "Data was not updated.",
      });
    } else {
      return res.json({
        success: 1,
        message: "Data was updated.",
        data: updatedUser,
      });
    }
  } catch (error) {
    return res.json({
      success: 0,
      message: "Error in code.",
      error: error.message,
    });
  }
};

const userGet = async (req, res) => {
  try {
    const getUser = await user.find({});
    if (!getUser) {
      return res.json({
        success: 0,
        message: "User not found",
      });
    } else {
      return res.json({
        success: 1,
        message: "User found",
        data: getUser,
      });
    }
  } catch (error) {
    return res.json({
      success: 0,
      message: "Error in code",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await user.findById(id);
    if (!userData) {
      return res.json({
        success: 0,
        message: "User not found",
      });
    } else {
      return res.json({
        success: 1,
        message: "User details fetched successfully",
        data: userData,
      });
    }
  } catch (error) {
    return res.json({
      success: 0,
      message: "Error fetching user details",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  updateUser,
  userGet,
  getUserById,
};

