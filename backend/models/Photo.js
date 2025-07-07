// models/Photo.js
const { pool } = require("../config/db");

const create = async ({ image, title, userId }) => {
  const { rows } = await pool.query(
    "INSERT INTO photos (image, title, user_id) VALUES ($1, $2, $3) RETURNING *, (SELECT name FROM users WHERE id = $3) as user_name",
    [image, title, userId]
  );
  // Manually format to match old structure if needed
  const newPhoto = rows[0];
  return {
    id: newPhoto.id,
    image: newPhoto.image,
    title: newPhoto.title,
    userId: newPhoto.user_id,
    userName: newPhoto.user_name,
    createdAt: newPhoto.created_at,
    likes: [], // Starts with no likes
    comments: [], // Starts with no comments
  };
};

const findById = async (id) => {
  const query = `
        SELECT
            p.*,
            u.name as user_name,
            (SELECT json_agg(json_build_object('userId', l.user_id)) FROM likes l WHERE l.photo_id = p.id) as likes,
            (SELECT json_agg(json_build_object('comment', c.comment, 'userName', cu.name, 'userImage', cu.profile_image, 'userId', c.user_id)) FROM comments c JOIN users cu ON c.user_id = cu.id WHERE c.photo_id = p.id) as comments
        FROM photos p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = $1;
    `;
  const { rows } = await pool.query(query, [id]);
  const photo = rows[0];
  if (photo) {
    photo.likes = photo.likes || [];
    photo.comments = photo.comments || [];
  }
  return photo;
};

const findAll = async () => {
  const { rows } = await pool.query(
    "SELECT p.*, u.name as user_name FROM photos p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC"
  );
  return rows;
};

const findByUserId = async (userId) => {
  const { rows } = await pool.query(
    "SELECT * FROM photos WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return rows;
};

const findByTitle = async (query) => {
  const { rows } = await pool.query(
    "SELECT * FROM photos WHERE title ILIKE $1",
    [`%${query}%`]
  );
  return rows;
};

const deleteById = async (id) => {
  await pool.query("DELETE FROM photos WHERE id = $1", [id]);
};

const update = async (id, { title, image }) => {
  const { rows } = await pool.query(
    "UPDATE photos SET title = COALESCE($1, title), image = COALESCE($2, image) WHERE id = $3 RETURNING *",
    [title, image, id]
  );
  return rows[0];
};

const addLike = async (photoId, userId) => {
  try {
    await pool.query(
      "INSERT INTO likes (photo_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [photoId, userId]
    );
  } catch (error) {
    console.error("Erro ao adicionar like:", error);
    throw error;
  }
};

const addComment = async (photoId, { comment, userId }) => {
  const { rows } = await pool.query(
    "INSERT INTO comments (photo_id, comment, user_id) VALUES ($1, $2, $3) RETURNING *",
    [photoId, comment, userId]
  );
  return rows[0];
};

module.exports = {
  create,
  findById,
  findAll,
  findByUserId,
  findByTitle,
  deleteById,
  update,
  addLike,
  addComment,
};
