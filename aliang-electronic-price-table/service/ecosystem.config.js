module.exports = {
  apps: [
    {
      name: 'aliang-price-service',
      script: 'src/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      output: './logs/output.log',
      error: './logs/error.log',
      log: './logs/combined.log',
      log_type: 'json',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};