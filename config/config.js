var DB = 'mongodb://localhost:27017/test';
var PORT = process.env.PORT || 3000;
var SALT_FACTOR = 10; 
var SECRET = 'TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX';

module.exports = {
  db: DB,
  port: PORT,
  salt: SALT_FACTOR,
  secret: SECRET
};

