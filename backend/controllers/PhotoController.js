const Photo = require("../models/Photo");
const User = require("../models/User");

// Insert a photo, with an user related to it
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  try {
    const newPhoto = await Photo.create({
      image,
      title,
      userId: reqUser.id,
    });

    if (!newPhoto) {
      return res.status(422).json({
        errors: ["An error occurred, please try again later."],
      });
    }

    res.status(201).json(newPhoto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Internal server error."] });
  }
};

// Remove a photo from the DB
const deletePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ errors: ["Photo not found."] });
    }

    if (photo.user_id !== reqUser.id) {
      return res
        .status(422)
        .json({ errors: ["An error occurred, please try again later."] });
    }

    await Photo.deleteById(id);

    res
      .status(200)
      .json({ id: photo.id, message: "Photo successfully deleted." });
  } catch (error) {
    console.error(error);
    res.status(404).json({ errors: ["Photo not found."] });
  }
};

// Get all photos
const getAllPhotos = async (req, res) => {
  const photos = await Photo.findAll();
  res.status(200).json(photos);
};

// Get user photos
const getUserPhotos = async (req, res) => {
  const { id } = req.params;
  const photos = await Photo.findByUserId(id);
  res.status(200).json(photos);
};

// Get photo by id
const getPhotoById = async (req, res) => {
  const { id } = req.params;
  try {
    const photo = await Photo.findById(id);
    if (!photo) {
      return res.status(404).json({ errors: ["Photo not found."] });
    }
    res.status(200).json(photo);
  } catch (error) {
    console.error(error);
    res.status(404).json({ errors: ["Photo not found."] });
  }
};

// Update a photo
const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const image = req.file ? req.file.filename : null;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ errors: ["Photo not found."] });
    }

    if (photo.user_id !== reqUser.id) {
      return res
        .status(422)
        .json({ errors: ["An error occurred, please try again later."] });
    }

    const updatedPhoto = await Photo.update(id, { title, image });

    res
      .status(200)
      .json({ photo: updatedPhoto, message: "Photo updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Internal server error."] });
  }
};

// Like a photo
const likePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ errors: ["Photo not found."] });
    }

    // Check if the photo has already been liked by this user
    const alreadyLiked = photo.likes.some((like) => like.userId === reqUser.id);
    if (alreadyLiked) {
      return res
        .status(422)
        .json({ errors: ["You have already liked this photo."] });
    }

    await Photo.addLike(id, reqUser.id);

    res
      .status(200)
      .json({
        photoId: id,
        userId: reqUser.id,
        message: "The photo was liked.",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Internal server error."] });
  }
};

// Comment on a photo
const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const reqUser = req.user;

  try {
    const user = await User.findById(reqUser.id);
    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ errors: ["Photo not found."] });
    }

    await Photo.addComment(id, { comment, userId: user.id });

    const userComment = {
      comment,
      userName: user.name,
      userImage: user.profile_image,
      userId: user.id,
    };

    res.status(200).json({
      comment: userComment,
      message: "Comment added successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Internal server error."] });
  }
};

// Search photos by title
const searchPhotos = async (req, res) => {
  const { q } = req.query;
  const photos = await Photo.findByTitle(q);
  res.status(200).json(photos);
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
};
