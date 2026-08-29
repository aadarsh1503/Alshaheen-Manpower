module.exports = {
  apps: [
    {
      name: 'alshaheen-server',
      script: 'index.js',
      node_args: '--openssl-legacy-provider',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
