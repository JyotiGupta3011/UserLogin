const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes [cite: 33]
  max: 100, // limit each IP to 100 requests per windowMs 
});

module.exports = limiter; // <--- MUST HAVE THIS LINE