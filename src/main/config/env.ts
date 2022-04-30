export default {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT ?? 3000,
  jwtSecret: process.env.JWT_SECRET ?? 'tj650==5H123'
};
