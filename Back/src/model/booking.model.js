const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    products: [{
        productId: {
            type: String,
            ref: 'Prodcut'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Completed'
    }
}, { timestamps: true })

const Booking = mongoose.model('Booking', bookingSchema)
module.exports = Booking