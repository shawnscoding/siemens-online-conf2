"use strict";

module.exports = {
  apps: [
    {
      name: "siemens-front",
      script: "serve -s build",
      watch: false,
      env: {
        PORT: "7000",
        NODE_ENV: "production",
        NODE_OPTIONS: "--max-old-space-size=4096",
      },
      time: true,
    },
  ],
};
