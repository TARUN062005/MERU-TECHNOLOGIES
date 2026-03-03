require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

console.log('🔄 Initializing API Server...');

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend Express API is actively running on http://localhost:${PORT}`);
  });
});
