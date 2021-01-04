module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'dev',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://blakefitzpatrick@localhost/postgres',
    JWT_SECRET: process.env.JWT_SECRET || 'josieSally',
  }