// pm2 deploy production --force
// pm2 start ./network/ecosystem.config.js --env production
// pm2 start ./network/ecosystem.config.js --env dev
// ll /root/.pm2/logs/
// pm2 logs --timestamp

module.exports = {
  apps: [
    {
      name: "artist-dashboard",
      cwd: "/var/www/artist-dashboard/source/api/dist",
      script: "index.js",
      max_memory_restart: "200M",
      instances: "MAX",
      exec_mode: "cluster",
      time: true,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "shopify-order-cron",
      cwd: "/var/www/artist-dashboard/source/api/dist/services",
      script: "cron.js",
      max_memory_restart: "100M",
      instances: 1,
      time: true,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "stage-artist-dashboard",
      cwd: "/var/www/stage-artist-dashboard/source/api/dist",
      script: "index.js",
      max_memory_restart: "200M",
      instances: 2,
      exec_mode: "cluster",
      time: true,
      env: {
        PORT: 4001,
        NODE_ENV: "stage",
      },
    },
    {
      name: "local-artist-dashboard",
      cwd: "/Users/btran/Documents/Code/Teefury/artist-dashboard-2/api/dist",
      script: "index.js",
      max_memory_restart: "200M",
      instances: 2,
      exec_mode: "cluster",
      time: true,
      env: {
        PORT: 3001,
        NODE_ENV: "development",
      },
    },
  ],
  deploy: {
    production: {
      user: "root",
      key: "~/.ssh/id_rsa_hetnzer_artist_dashboard_2",
      host: ["95.217.162.146"],
      ref: "origin/master",
      path: "/var/www/artist-dashboard",
      repo: "https://github.com/btran-teefury/artist-dashboard-2.git",
      "post-deploy":
        // "npm install && npm run build && cd client && npm install && npm run build && cd ./.. && pm2 startOrRestart ./network/ecosystem.config.js --only artist-dashboard && pm2 startOrRestart ./network/ecosystem.config.js --only shopify-order-cron",
        "npm install && npm run build && cd client && npm install && npm run build && cd ./.. && pm2 startOrRestart ./network/ecosystem.config.js --only artist-dashboard",
    },
    stage: {
      user: "root",
      key: "~/.ssh/id_rsa_hetnzer_artist_dashboard_2",
      host: ["95.217.162.146"],
      ref: "origin/feature/hfolk_create-delete-button-for-art-files",
      path: "/var/www/stage-artist-dashboard",
      repo: "https://github.com/btran-teefury/artist-dashboard-2.git",
      "post-deploy":
        "npm install && npm run build && cd client && npm install && npm run build && cd ./.. && pm2 startOrRestart ./network/ecosystem.config.js --only stage-artist-dashboard",
    },
  },
};
