const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const { validate: isUuid } = require("uuid");
// Generate user token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
};

// Register user and sign in
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOneByEmail(email);

    if (user) {
      return res.status(422).json({ errors: ["Please use another email."] });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({ name, email, password: passwordHash });

    if (!newUser) {
      return res
        .status(422)
        .json({ errors: ["An error occurred, please try again later."] });
    }

    res.status(201).json({ _id: newUser.id, token: generateToken(newUser.id) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Internal server error."] });
  }
};

// Sign user in
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("BODY RECEBIDO NO BACKEND:", req.body, email, password);

  try {
    const user = await User.findOneByEmail(email);
    console.log("BODY RECEBIDO NO BACKEND:", req.body, email, password, user);

    if (!user) {
      return res.status(404).json({ errors: ["User not found."] });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(422).json({ errors: ["Invalid password."] });
    }

    res.status(200).json({
      _id: user.id,
      profileImage: user.profile_image,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Internal server error."] });
  }
};

// Get current logged in user
const getCurrentUser = async (req, res) => {
  // req.user is set by the auth middleware
  const user = req.user;
  res.status(200).json(user);
};

// Update an user
const update = async (req, res) => {
  const { name, password, bio } = req.body;
  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  try {
    const userToUpdate = await User.findById(reqUser.id);
    if (!userToUpdate) {
      return res.status(404).json({ errors: ["User not found."] });
    }

    let passwordHash = null;
    if (password) {
      const salt = await bcrypt.genSalt();
      passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.update(reqUser.id, {
      name,
      password: passwordHash,
      profileImage,
      bio,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Internal server error."] });
  }
};

// Get user by id
const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ errors: ["Invalid user ID format."] });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ errors: ["User not found."] });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Internal server error."] });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
};
