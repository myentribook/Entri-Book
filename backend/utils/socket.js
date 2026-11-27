const userModel = require('../models/userModel')

const setupSocket = (io) => {
    if (!io || typeof io.on !== 'function') {
        console.log("Invalid Socket.IO server instance passed to setupSocket");
        return;
    }

    io.on('connection', async (socket) => {
        // Frontend-la irunthu auth la anupura userId inga varum
        const rawUserId = socket.handshake?.auth?.userId;
        const userId = typeof rawUserId === 'string' && rawUserId.trim().length > 0
            ? rawUserId.trim()
            : null;

        console.log("A user connected, Socket ID:", socket.id, "User ID:", userId);

        if (userId) {
            try {
                // Database-la user-a online-ku mathrom
                await userModel.findByIdAndUpdate(userId, { isOnline: true });
                console.log(`User ${userId} is now ONLINE in DB`);

                // Ellaa admin/users-kum broadcast panrom
                io.emit('userStatusChanged', { userId, isOnline: true });

                // User disconnect aana (Tab-a moodunalo, logout aanalo)
                socket.on('disconnect', async () => {
                    try {
                        const updatedTime = new Date();
                        await userModel.findByIdAndUpdate(userId, {
                            isOnline: false,
                            lastSeen: updatedTime
                        });
                        console.log(`User ${userId} is now OFFLINE in DB`);

                        io.emit('userStatusChanged', {
                            userId,
                            isOnline: false,
                            lastSeen: updatedTime
                        });
                    } catch (disconnectErr) {
                        console.log("Error updating socket offline status in DB:", disconnectErr.message);
                    }
                });
            } catch (err) {
                console.log("Error updating socket status in DB:", err.message);
            }
        } else {
            console.log("Socket connected without userId in auth!");
        }
    });
}

//antha thevaiyaatha getReceiverSocketId function-a inga remove panniyachu
module.exports = { setupSocket }