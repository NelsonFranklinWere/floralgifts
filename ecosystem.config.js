// PM2 Ecosystem Configuration for Floral Whispers Gifts
module.exports = {
  apps: [
    {
      name: 'floralgifts',
      script: 'npm',
      args: 'start',
      cwd: '/home/floral/floralgifts',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NODE_OPTIONS: '--max-old-space-size=2048', // 2GB for runtime
      },
      error_file: '/home/floral/floralgifts/logs/pm2-error.log',
      out_file: '/home/floral/floralgifts/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1536M', // Restart if memory exceeds 1.5GB (1536MB)
    },
  ],
};

