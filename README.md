# Crypto Trading Assistant

A full-stack cryptocurrency trading assistant built with Vue.js, Bulma CSS, and Express.js.

## Features

- **Portfolio Tracking**: Monitor your cryptocurrency investments
- **Price Alerts**: Get notifications when prices reach target levels
- **Trading Signals**: Receive intelligent trading recommendations
- **Responsive Design**: Built with Bulma CSS framework
- **Hot Reload Development**: Fast development with webpack-dev-server

## Project Structure

```
crypto-trading-assistant/
├── src/
│   ├── App.vue          # Main Vue component
│   ├── main.js          # Vue app entry point
│   └── index.html       # HTML template
├── server.js            # Express server
├── webpack.config.js    # Webpack configuration
├── package.json         # Dependencies and scripts
├── .env                 # Environment variables
└── README.md           # This file
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env to set your preferred PORT (default: 3000)
```

## Development

Start the development server with hot reloading:

```bash
npm run dev
```

This will start:
- Express server on port 3000 (or your configured PORT)
- Webpack dev server on port 8080 with hot reloading
- API proxy from frontend to backend

Visit `http://localhost:8080` to view the application.

## Production Build

Build the application for production:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

The built files will be served from the `public/` directory.

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/crypto/status` - Get application status and features

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

## Technology Stack

- **Frontend**: Vue.js 3, Bulma CSS, Font Awesome
- **Backend**: Node.js, Express.js
- **Build Tools**: Webpack 5, Babel
- **Development**: Hot Module Replacement, Nodemon

## Scripts

- `npm run dev` - Start development servers with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run server:dev` - Start only the Express server
- `npm run client:dev` - Start only the webpack dev server

## Next Steps

This is a foundation for building out crypto trading features. You can now add:

1. Real cryptocurrency data integration
2. Portfolio management
3. Price alert system
4. Trading signal algorithms
5. User authentication
6. Database integration

The development environment is ready for rapid iteration and feature development!