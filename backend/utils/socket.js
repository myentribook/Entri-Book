const userModel = require('../models/userModel')

const setupSocket = (io) => {
    io.on('connection', async (socket) => {
        // Frontend-la irunthu auth la anupura userId inga varum
        const userId = socket.handshake.auth?.userId;

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