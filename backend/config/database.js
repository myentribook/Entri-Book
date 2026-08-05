// const mongoose = require('mongoose')

// const connectDatabase = () => {

//     mongoose.connect(process.env.DB_LOCAL_URI).then((con) => {
//         console.log(`Mongo DB is connected to the Database : ${con.connection.host} `)
//     })

// }

// module.exports = connectDatabase

const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI)
        .then((con) => {
            console.log(`Mongo DB is connected to the Database : ${con.connection.host}`);
        })
        .catch((err) => {
            console.log(`MongoDB connection error: ${err.message}`);
        });
};

module.exports = connectDatabase;