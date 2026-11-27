const express = require('express')

const app = express()

const cookieParser = require('cookie-parser')

const cors = require("cors");

const path = require('path')

const allowedOrigins = ["http://localhost:3000", "http://www.myentribook.in", "https://www.myentribook.in", "http://16.171.148.56:8000"];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));


const error = require('./middlewares/error')

const products = require('./routes/product')

const user = require('../backend/routes/Auth')

const purchase = require('./routes/purchase')

const Bill = require('./routes/Bill')

const payment = require('./routes/subscriptionRoutes')


const Report = require('./routes/report')

const Dashboard = require('./routes/Dashboard')

const webHook = require('./routes/webHook')

const comment = require('./routes/coment')


app.use(express.json({
    verify: (req, res, buf) => {
        if (req.originalUrl && req.originalUrl.includes('webhook')) {
            req.rawBody = buf;
        }
    }
}));

app.use(express.urlencoded({ extended: true }));

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


if (process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase() === 'PRODUCTION') {
    const buildPath = path.resolve(__dirname, '../frontend/build');
    const indexHtmlPath = path.resolve(buildPath, 'index.html');

    app.use(express.static(buildPath));

    app.get(/.*/, (req, res, next) => {
        res.sendFile(indexHtmlPath, (err) => {
            if (err) {
                next(err);
            }
        });
    });
}



app.use(error)

module.exports = app