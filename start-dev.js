const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

console.log('🚀 Starting Crypto Trading Assistant in development mode...');
console.log(`📡 Server will run on port ${PORT}`);
console.log(`🌐 Frontend dev server will run on port 8080`);

// Start the Express server
const server = spawn('nodemon', ['server.js'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

// Wait a bit for server to start, then start webpack dev server
setTimeout(() => {
  console.log('🔧 Starting webpack dev server...');
  const webpack = spawn('npx', ['webpack', 'serve', '--config', 'webpack.config.js', '--mode', 'development'], {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  webpack.on('close', (code) => {
    console.log(`Webpack dev server exited with code ${code}`);
    server.kill();
  });
}, 3000);

server.on('close', (code) => {
  console.log(`Express server exited with code ${code}`);
  process.exit(code);
});

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  server.kill('SIGINT');
  process.exit(0);
});