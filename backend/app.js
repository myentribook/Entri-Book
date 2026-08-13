const express = require('express')

const app = express()

const cookieParser = require('cookie-parser')

const cors = require("cors");

const path = require('path')

// const 


// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true
// }));

app.use(cors({
    origin: ["http://localhost:3000", "http://www.myentribook.in", "https://www.myentribook.in" , "http://16.171.148.56:8000"],
    credentials: true
}));


const error = require('./middlewares/error')

const products = require('./routes/product')

const user = require('../backend/routes/Auth')

const purchase = require('./routes/purchase')

const Bill = require('./routes/Bill')

const payment = require('./routes/subscriptionRoutes')

// const whatsApp = require('./routes/whatsApp')

const Report = require('./routes/report')

const Dashboard = require('./routes/Dashboard')

const webHook = require('./routes/webHook')

const comment = require('./routes/coment')


app.use(express.json())

app.use(cookieParser())

app.use('/api/v1/', products)

app.use('/api/v1/', user)

app.use('/api/v1/', purchase)

app.use('/api/v1/', Bill)

app.use('/api/v1/', payment)

app.use('/api/v1', comment)

app.use('/api/v1/', Report)

app.use('/api/v1/', Dashboard)

app.use('/api/v1/', webHook)


if (process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))
    
    app.get(/.*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}



app.use(error)

module.exports = app
