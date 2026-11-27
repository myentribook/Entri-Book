const multer = require('multer');

// Memory storage-ah configure pandrom
const storage = multer.memoryStorage();

// Ippadi export pannunga
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB default limit to protect server memory
    }
});

module.exports = upload;