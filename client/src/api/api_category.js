import axios from "axios";

const url = "/api/category";

export default class RecordAPI {
  static async getAllCategories() {
    const res = await axios.get(url);
    return res.data;
  }

  static async getCategoryById(id) {
    const res = await axios.get(`${url}/${id}`);
    return res.data;
  }

  static async createCategory(category) {
    const res = await axios.post(url, category);
    return res.data;
  }

  static async updateCategory(id, category) {
    const res = await axios.put(`${url}/${id}`, category);
    return res.data;
  }

  static async deleteCategory(id) {
    const res = await axios.delete(`${url}/${id}`);
    return res.data;
  }
}
