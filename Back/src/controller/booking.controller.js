const mongoose = require('mongoose');
const Booking = require('../model/booking.model')

const createBooking = async (req, res) => {
    try {
        const { userId, products, totalAmount } = req.body;
        const newBooking = new Booking({
            userId,
            products,
            totalAmount
        });
        const savedBooking = await newBooking.save();
        if (savedBooking) {
            return res.json({
                success: 1,
                message: "Order placed successfully",
                data: savedBooking
            });
        } else {
            return res.json({
                success: 0,
                message: "Failed to place order"
            });
        }
    } catch (error) {
        return res.json({
            success: 0,
            message: "Error in creating order",
            error: error.message
        });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Fetching orders for userId:", id);
        
        // Security check
        if (req.user.role !== 'admin' && req.user.id !== id) {
            return res.status(403).json({
                success: 0,
                message: "Unauthorized access to order history."
            });
        }

        // Use lean to avoid CastErrors during population
        const bookings = await Booking.find({ userId: id }).sort({ createdAt: -1 }).lean();
        
        // Identify valid product IDs for population
        const validProductIds = [];
        bookings.forEach(b => {
            b.products.forEach(p => {
                if (mongoose.Types.ObjectId.isValid(p.productId)) {
                    validProductIds.push(p.productId);
                }
            });
        });

        // Fetch products in bulk
        const products = await require('../model/product.model').find({ _id: { $in: validProductIds } }).lean();
        const productMap = new Map(products.map(p => [p._id.toString(), p]));

        // Manually assemble
        const orders = bookings.map(b => ({
            ...b,
            products: b.products.map(p => ({
                ...p,
                productId: productMap.get(p.productId.toString()) || { productName: "Unknown Product", id: p.productId }
            }))
        }));

        return res.json({
            success: 1,
            message: orders.length > 0 ? "Orders fetched successfully" : "No orders found",
            data: orders
        });
    } catch (error) {
        console.error("Error in getUserOrders resilience layer:", error);
        return res.status(500).json({
            success: 0,
            message: "Error processing order history",
            error: error.message
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        console.log("Admin fetching all platform orders...");
        
        // Fetch lean bookings to avoid Mongoose internal casting issues during population
        const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();
        
        // Identify valid user IDs for population
        const validUserIds = bookings
            .filter(b => mongoose.Types.ObjectId.isValid(b.userId))
            .map(b => b.userId);
            
        // Identify valid product IDs for population
        const validProductIds = [];
        bookings.forEach(b => {
            b.products.forEach(p => {
                if (mongoose.Types.ObjectId.isValid(p.productId)) {
                    validProductIds.push(p.productId);
                }
            });
        });

        // Fetch related data in bulk
        const [users, products] = await Promise.all([
            require('../model/user.model').find({ _id: { $in: validUserIds } }).select('firstName lastName email').lean(),
            require('../model/product.model').find({ _id: { $in: validProductIds } }).lean()
        ]);

        // Build lookup maps
        const userMap = new Map(users.map(u => [u._id.toString(), u]));
        const productMap = new Map(products.map(p => [p._id.toString(), p]));

        // Manually assemble results
        const orders = bookings.map(b => ({
            ...b,
            userId: userMap.get(b.userId.toString()) || b.userId, // Return object if found, else original string ID
            products: b.products.map(p => ({
                ...p,
                productId: productMap.get(p.productId.toString()) || { productName: "Unknown Product", id: p.productId }
            }))
        }));

        return res.json({
            success: 1,
            message: "All orders fetched successfully",
            data: orders
        });
    } catch (error) {
        console.error("Error in getAllOrders resilience layer:", error);
        return res.status(500).json({
            success: 0,
            message: "Internal server failure during order processing",
            error: error.message
        });
    }
};

module.exports = {
    createBooking,
    getUserOrders,
    getAllOrders
};