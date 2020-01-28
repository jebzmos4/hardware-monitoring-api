module.exports = {
  name: 'hardware-monitoring-api',
  file: '../logs/',
  env: process.env.NODE_ENV || 'development',
  server: {
    port: process.env.PORT,
    baseUrl: process.env.BASE_URL
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    console: process.env.LOG_ENABLE_CONSOLE || true
  },
  mongo: {
    salt_value: 10,
    connection: {
      host: process.env.MONGODB_HOST,
      username: process.env.MONGODB_USER,
      password: process.env.MONGODB_PASSWORD,
      port: process.env.MONGODB_PORT,
      perpage: 5,
      dbProd: process.env.MONGODB_DATABASE_NAME
    },
    collections: {
      hardware: 'hardware-monitoring-api'
    },
    queryLimit: process.env.MONGODB_QUERY_LIMIT,
    questionLimit: process.env.QUESTION_LIMIT
  },
  pusher: {
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    encrypted: process.env.PUSHER_ENCRYPTED,
    channel: 'hardware-channel',
    event: 'trigger-event'
  },
  sendGrid: {
    apiKey: process.env.SENDGRID_API_KEY
  }
};
