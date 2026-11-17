// // // 1. LOAD ENV FIRST (MOST IMPORTANT FIX)
// // const dotenv = require('dotenv')
// // const path = require('path')



// // dotenv.config({ path: path.join(__dirname, 'config/config.env') })

// // // 2. NOW IMPORT EVERYTHING
// // const app = require('./app')
// // const connectDatabase = require('./config/database')

// // // 3. CONNECT DB
// // connectDatabase()

// // // 4. START SERVER
// // const server = app.listen(process.env.PORT, () => {
// //     console.log(
// //         `Server running on port: ${process.env.PORT} in ${process.env.NODE_ENV}`
// //     )
// // })

// // // 5. HANDLE UNHANDLED PROMISE ERRORS
// // process.on('unhandledRejection', (error) => {
// //     console.log(`Error: ${error.message}`)
// //     console.log(`Shutting down server due to unhandled rejection error!`)

// //     server.close(() => {
// //         process.exit(1)
// //     })
// // })

// // // 6. HANDLE CRASH ERRORS
// // process.on('uncaughtException', (error) => {
// //     console.log(`Error: ${error.message}`)
// //     console.log(`Shutting down server due to uncaught exception error!`)

// //     server.close(() => {
// //         process.exit(1)
// //     })
// // })



// // 1. LOAD ENV FIRST (MOST IMPORTANT FIX)
// const dotenv = require('dotenv')
// const path = require('path')

// dotenv.config({ path: path.join(__dirname, 'config/config.env') })

// // 2. IMPORT EXPRESS, HTTP, SOCKET.IO & OTHER MODULES
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const { setupSocket } = require('./utils/socket'); // Ungaloda socket file path

// const app = require('./app')
// const connectDatabase = require('./config/database')

// // 3. CREATE HTTP SERVER FOR EXPRESS AND SOCKET.IO
// const server = http.createServer(app)

// // 4. INITIALIZE SOCKET.IO WITH CORS
// const io = new Server(server, {
//     cors: {
//         origin: "*", // Production-la unga frontend URL-a inga podanum
//         methods: ["GET", "POST"]
//     },
// })

// // Pass io to our socket utility
// setupSocket(io);

// // Make io accessible in controllers if needed
// app.set('io', io);

// // 5. CONNECT DB
// connectDatabase()

// // 6. START SERVER (Using http server instead of app.listen)
// server.listen(process.env.PORT, () => {
//     console.log(
//         `Server running on port: ${process.env.PORT} in ${process.env.NODE_ENV}`
//     )
// })

// // 7. HANDLE UNHANDLED PROMISE ERRORS
// process.on('unhandledRejection', (error) => {
//     console.log(`Error: ${error.message}`)
//     console.log(`Shutting down server due to unhandled rejection error!`)

//     server.close(() => {
//         process.exit(1)
//     })
// })

// // 8. HANDLE CRASH ERRORS
// process.on('uncaughtException', (error) => {
//     console.log(`Error: ${error.message}`)
//     console.log(`Shutting down server due to uncaught exception error!`)

//     server.close(() => {
//         process.exit(1)
//     })
// })


// 1. LOAD ENVIRONMENT VARIABLES FIRST
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.join(__dirname, 'config/config.env')
});

// 2. IMPORT MODULES
const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');
const connectDatabase = require('./config/database');
const { setupSocket } = require('./utils/socket');

// 3. CREATE HTTP SERVER
const server = http.createServer(app);

// 4. SOCKET.IO CORS CONFIGURATION
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim())
    : [];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// 5. INITIALIZE SOCKET.IO
setupSocket(io);

// Make Socket.IO available in controllers
app.set('io', io);

// 6. START SERVER AFTER DATABASE CONNECTION
const startServer = async () => {
    try {
        await connectDatabase();

        const PORT = process.env.PORT || 8000;

        server.listen(PORT, () => {
            console.log(
                `Server running on port: ${PORT} in ${process.env.NODE_ENV}`
            );
        });

    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

// 7. HANDLE UNHANDLED PROMISE REJECTIONS
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);

    server.close(() => {
        process.exit(1);
    });
});

// 8. HANDLE UNCAUGHT EXCEPTIONS
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);

    server.close(() => {
        process.exit(1);
    });
});

// 9. START APPLICATION
startServer();
