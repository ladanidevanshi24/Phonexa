const Admin = require("../model/admin.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "phonex_secret_key";

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Static credentials support
    if (email === "admin@phonex.com" && password === "admin123") {
      const token = jwt.sign(
        { id: "admin_static", email, role: "admin" },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.json({
        success: 1,
        message: "Admin Login Successfully.",
        token,
        data: { 
          _id: "admin_static",
          email, 
          role: "admin", 
          firstName: "System", 
          lastName: "Admin" 
        },
      });
    }

    const adminUser = await Admin.findOne({ email });
    if (adminUser) {
        // Support both hashed and plain (for transition)
        const isMatch = await bcrypt.compare(password, adminUser.password).catch(() => false);
        if (isMatch || password === adminUser.password) {
            const token = jwt.sign(
                { id: adminUser._id, email: adminUser.email, role: "admin" },
                JWT_SECRET,
                { expiresIn: "7d" }
            );
            return res.json({
                success: 1,
                message: "Admin Login Successfully.",
                token,
                data: adminUser,
            });
        }
    }

    return res.json({
      success: 0,
      message: "Invalid Admin Credentials",
    });
  } catch (error) {
    return res.json({
      success: 0,
      message: "Error during admin login",
      error: error.message,
    });
  }
};

const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        if (id === 'admin_static') {
            return res.json({
                success: 1,
                data: { _id: "admin_static", email: "admin@phonex.com", firstName: "System", lastName: "Admin", role: "admin" }
            });
        }
        const adminData = await Admin.findById(id);
        if (!adminData) {
            return res.json({ success: 0, message: "Admin not found" });
        }
        return res.json({ success: 1, data: adminData });
    } catch (error) {
        return res.json({ success: 0, message: "Error fetching admin details", error: error.message });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        
        if (id === 'admin_static') {
            return res.json({ success: 0, message: "Cannot update static system admin. Please use a database admin account." });
        }

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        if (!updatedAdmin) {
            return res.json({ success: 0, message: "Admin update failed" });
        }
        return res.json({ success: 1, message: "Admin profile updated", data: updatedAdmin });
    } catch (error) {
        return res.json({ success: 0, message: "Error updating admin profile", error: error.message });
    }
};

module.exports = {
  adminLogin,
  getAdminById,
  updateAdmin
};
