const DB = 'mongodb://localhost:27017/test';
const PORT = process.env.PORT || 3000;
const SALT_FACTOR = 10; 


module.exports = {
  db: DB,
  port: PORT,
  salt: SALT_FACTOR
};

