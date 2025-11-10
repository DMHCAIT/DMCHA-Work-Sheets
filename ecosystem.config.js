module.exports = {
  apps: [
    {
      name: 'dmhca-backend',
      script: 'src/server.js',
      cwd: './backend',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
}
