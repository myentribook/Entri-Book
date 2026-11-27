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
    ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim()).filter(Boolean)
    : [];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins.length > 0 ? allowedOrigins : true,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// 5. INITIALIZE SOCKET.IO
setupSocket(io);

// Make Socket.IO available in controllers
app.set('io', io);

let isShuttingDown = false;

const shutdownGracefully = (exitCode = 1) => {
    if (isShuttingDown) {
        return;
    }
    isShuttingDown = true;

    const forceExitTimer = setTimeout(() => {
        process.exit(exitCode);
    }, 10000);

    if (typeof forceExitTimer.unref === 'function') {
        forceExitTimer.unref();
    }

    if (server.listening) {
        server.close(() => {
            clearTimeout(forceExitTimer);
            process.exit(exitCode);
        });
    } else {
        clearTimeout(forceExitTimer);
        process.exit(exitCode);
    }
};

// 6. START SERVER AFTER DATABASE CONNECTION
const startServer = async () => {
    try {
        await connectDatabase();

        const rawPort = Number(process.env.PORT);
        const PORT = Number.isInteger(rawPort) && rawPort > 0 ? rawPort : 8000;

        server.listen(PORT, () => {
            console.log(
                `Server running on port: ${PORT} in ${process.env.NODE_ENV || 'development'}`
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
    shutdownGracefully(1);
});

// 8. HANDLE UNCAUGHT EXCEPTIONS
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    shutdownGracefully(1);
});

// 9. START APPLICATION
startServer();