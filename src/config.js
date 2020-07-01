module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 8080,
  JWT_SECRET: process.env.JWT_SECRET || "change-this-secret",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgres://habituser:habit1234@localhost/habitapp",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    "postgres://habituser:habit1234@localhost/habitapp_test",
};
