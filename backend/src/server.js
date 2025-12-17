// ⚙️ backend/src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI ||
    'mongodb+srv://odin_user:MyStrongPass123@cluster0.cytwbpp.mongodb.net/odin_db?retryWrites=true&w=majority',
  {
    // Removed deprecated options
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  },
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB');
});

// Import routes
const businessRoutes = require('./routes/business');
const gamificationRoutes = require('./routes/gamification');
const negotiationRoutes = require('./routes/negotiation');
const auth = require('./middleware/auth');

// Use routes
app.use('/api/business', businessRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/negotiation', negotiationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: db.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// WebSocket server for real-time features
const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', ws => {
  console.log('New WebSocket connection established');

  ws.on('message', message => {
    try {
      const data = JSON.parse(message);
      handleWebSocketMessage(ws, data);
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

function handleWebSocketMessage(ws, data) {
  switch (data.type) {
    case 'subscribe':
      // Subscribe to updates
      ws.subscribedChannels = data.channels || [];
      break;

    case 'unsubscribe':
      // Unsubscribe from updates
      ws.subscribedChannels = [];
      break;

    case 'xp_update':
      // Handle XP updates
      broadcastXpUpdate(data.userId, data.xpEarned);
      break;

    case 'level_up':
      // Handle level up notifications
      broadcastLevelUp(data.userId, data.newLevel);
      break;
  }
}

function broadcastXpUpdate(userId, xpEarned) {
  const message = JSON.stringify({
    type: 'xp_earned',
    userId,
    xpEarned,
    timestamp: new Date(),
  });

  wss.clients.forEach(client => {
    if (
      client.readyState === WebSocket.OPEN &&
      client.subscribedChannels?.includes('xp_updates')
    ) {
      client.send(message);
    }
  });
}
// ⚙️ backend/src/middleware/auth.js

module.exports = auth;
// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 WebSocket server running on port 8081`);
});

module.exports = app;
