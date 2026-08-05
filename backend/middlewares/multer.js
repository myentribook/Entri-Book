const multer = require('multer');

// Memory storage-ah configure pandrom
const storage = multer.memoryStorage(); 

// Ippadi export pannunga
const upload = multer({ storage: storage });

module.exports = upload;