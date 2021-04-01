require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

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

// start server
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
