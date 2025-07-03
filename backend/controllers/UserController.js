const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_SECRET;

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res.status(422).json({ errors: ["Por favor, utilizeoutro e-mail"] });
    return;
  }

  const salt = await bcrypt.genSalt();
  const passworHash = await bcrypt.hash(password, salt);

  const newUser = await User.create({ name, email, password: passworHash });

  if (!newUser) {
    res
      .status(422)
      .json({ errors: ["Houve um erro, por favor tente mais tarde."] });
  }

  res.status(201).json({ _id: newUser._id, token: generateToken(newUser._id) });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ errors: ["Usuário não encontrado."] });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ["Senha inválida."] });
  }

  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.status(200).json(user);
};

const update = async (req, res) => {
  const { name, password, bio } = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  const user = await User.findById(
    mongoose.Types.ObjectId(reqUser.__id)
  ).select("-password");

  if (name) {
    user.name = name;
  }

  if (password) {
    const salt = await bcrypt.genSalt();
    const passworHash = await bcrypt.hash(password, salt);

    user.password = passworHash;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }

  if (bio) {
    user.bio = bio;
  }

  await user.save();

  res.status(200).json(user);
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(mongoose.Types.ObjectId(id)).select(
      "-password"
    );

    if (!user) {
      res.send(404).json({ errors: ["Usuário não encontrado."] });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({ errors: ["Usuário não encontrado."] });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
};
