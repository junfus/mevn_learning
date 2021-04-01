require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes prefix
app.use("/api/category", require("./route/route_category"));
app.use("/api/record", require("./route/route_record"));

// database connection
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log(`Connected to MongoDB at ${process.env.DB_URI}`))
  .catch((err) => console.log(err));

// handle production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "./public")));

  // handle SPA
  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "./public/index.html"));
  });
}

// start server
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
