// pm2 deploy production --force
// pm2 start ./network/ecosystem.config.js --env production
// pm2 start ./network/ecosystem.config.js --env dev
// ll /root/.pm2/logs/
// pm2 logs --timestamp

module.exports = {
  apps: [
    {
      name: "artist-dashboard",
      cwd: "/var/www/artist-dashboard/source",
      script: "npm start",
      max_memory_restart: "200M",
      time: true,
      env_dev: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "stage-artist-dashboard",
      cwd: "/var/www/stage-artist-dashboard/source",
      script: "npm start",
      max_memory_restart: "200M",
      time: true,
      env_production: {
        PORT: 4001,
        NODE_ENV: "production",
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
        "npm install && cd client && npm install && cd ./.. && pm2 reload ./network/ecosystem.config.js --only artist-dashboard --env production",
    },
    stage: {
      user: "root",
      key: "~/.ssh/id_rsa_hetnzer_artist_dashboard_2",
      host: ["95.217.162.146"],
      ref: "origin/stage",
      path: "/var/www/stage-artist-dashboard",
      repo: "https://github.com/btran-teefury/artist-dashboard-2.git",
      "post-deploy":
        "npm install && cd client && npm install && cd ./.. && pm2 reload ./network/ecosystem.config.js --only stage-artist-dashboard --env production",
    },
  },
};
