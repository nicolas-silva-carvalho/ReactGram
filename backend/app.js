const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Connect to PostgreSQL
const { connectToDB } = require("./config/db.js");
connectToDB();

const router = require("./routes/Router.js");

app.use(router);

app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});
