const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
  app.use(
      createProxyMiddleware('/api', {
          target: process.env.NODE_ENV === 'production' ? "https://develog-after7203.koyeb.app/3001" : 'http://localhost:3001/',
          changeOrigin: true
      })
  )
};