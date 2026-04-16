const express = require("express")
const app = express()
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
const path = require('path')
app.use(express.static(path.join(__dirname, '../build')));

const cors = require('cors')
app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

  
//Routig
const userRoute = require('./routes/user.routes')
const categoryRoute = require('./routes/category.routes')
const ProductRoute = require('./routes/product.routes')
const adminRoute = require('./routes/admin.routes')
const bookingRoute = require('./routes/booking.routes')
const aiRoute = require('./routes/ai.routes')

//Define Route
app.use('/api/v1/user' , userRoute)
app.use('/api/v1/categroy' , categoryRoute)
app.use('/api/v1/product' , ProductRoute)
app.use('/api/v1/admin' , adminRoute)
app.use('/api/v1/booking' , bookingRoute)
app.use('/api/v1/ai' , aiRoute)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'))
})
module.exports = app