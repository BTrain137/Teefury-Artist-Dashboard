// pm1 start ./network/ecosystem.config.js --env production
module.exports = {
  apps: [
    {
      name: "artist-dashboard",
      cwd: "../",
      script: "npm",
      args: "start:prod", 
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
}
