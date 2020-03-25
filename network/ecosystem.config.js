// pm2 start ./network/ecosystem.config.js --env production
module.exports = {
  apps: [
    {
      name: "artist-dashboard",
      script: "npm start",
      env: {
        NODE_ENV: "dev"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
