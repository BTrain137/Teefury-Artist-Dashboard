// pm2 start ./network/ecosystem.config.js --env production
// pm2 start ./network/ecosystem.config.js --env dev
// ll /root/.pm2/logs/

module.exports = {
  apps: [
    {
      name: "artist-dashboard",
      script: "npm start",
      max_memory_restart: "200M",
      env_dev: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
