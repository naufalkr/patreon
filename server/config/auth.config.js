require('dotenv').config();

console.log(process.env.SESSION_KEY);
module.exports = ({
  secret: process.env.SESSION_KEY
});