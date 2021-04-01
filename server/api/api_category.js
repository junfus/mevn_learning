const Category = require("../model/model_category");

module.exports = class API {
  static async getAllCategories(req, res) {
    try {
      const categories = await Category.find({});

      res.status(200).json(categories);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  static async getCategoryById(req, res) {
    const id = req.params.id;

    try {
      const categories = await Category.findById(id);

      res.status(200).json(categories);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  static async createCategory(req, res) {
    const category = req.body;

    await Category.create(category, (err, doc) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(201).json(doc);
      }
    });
  }

  static async updateCategory(req, res) {
    const id = req.params.id;
    const category = req.body;

    try {
      const result = await Category.findByIdAndUpdate(id, category);

      res.status(200).json({ message: "Category updated!" });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  static async deleteCategory(req, res) {
    const id = req.params.id;

    try {
      await Category.findByIdAndDelete(id);

      res.status(200).json({ message: "Category deleted!" });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
};
