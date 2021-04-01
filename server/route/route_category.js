const express = require("express");

const API = require("../api/api_category");
const router = express.Router();

router.get("/", API.getAllCategories);
router.get("/:id", API.getCategoryById);
router.post("/", API.createCategory);
router.put("/:id", API.updateCategory);
router.delete("/:id", API.deleteCategory);

module.exports = router;
