const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
      `mongodb+srv://nicolascarv:${dbPassword}@cluster0.adomvbe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );

    console.log("Conectou viu");

    return dbConn;
  } catch (error) {
    console.log(error);
  }
};

conn();
module.exports = conn;
