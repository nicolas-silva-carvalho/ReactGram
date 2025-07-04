// models/User.js
const { pool } = require("../config/db");

// Note: No schema definition like Mongoose.
// The structure is defined in your SQL database.

const findOneByEmail = async (email) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return rows[0];
};

const findById = async (id) => {
  const { rows } = await pool.query(
    "SELECT id, name, email, profile_image, bio FROM users WHERE id = $1",
    [id]
  );
  return rows[0];
};

const create = async ({ name, email, password }) => {
  const { rows } = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, password]
  );
  return rows[0];
};

const update = async (id, fields) => {
  const { name, password, profileImage, bio } = fields;
  const { rows } = await pool.query(
    `UPDATE users SET
            name = COALESCE($1, name),
            password = COALESCE($2, password),
            profile_image = COALESCE($3, profile_image),
            bio = COALESCE($4, bio)
        WHERE id = $5 RETURNING *`,
    [name, password, profileImage, bio, id]
  );
  return rows[0];
};

module.exports = {
  findOneByEmail,
  findById,
  create,
  update,
};
