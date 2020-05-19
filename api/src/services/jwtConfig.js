const { JWT_SECRET, BCRYPT_SALT_ROUNDS } = process.env;

module.exports = {
  secret: JWT_SECRET,
  BCRYPT_SALT_ROUNDS: BCRYPT_SALT_ROUNDS,
};
