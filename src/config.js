module.export = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL: process.env.DB_URL || 'postgres://dunder_mifflin@localhost/noteful',
}