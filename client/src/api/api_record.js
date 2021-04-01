import axios from "axios";

const url = "/api/record";

export default class RecordAPI {
  static async getAllRecordsIncludesDeletion() {
    const res = await axios.get(`${url}/all`);
    return res.data;
  }

  static async getAllRecords() {
    const res = await axios.get(url);
    return res.data;
  }

  static async getAllRecordsByCategory(cid) {
    const res = await axios.get(`${url}/cid/${cid}`);
    return res.data;
  }

  static async getRecordById(id) {
    const res = await axios.get(`${url}/${id}`);
    return res.data;
  }

  static async createRecord(record) {
    const res = await axios.post(url, record);
    return res.data;
  }

  static async updateRecord(id, record) {
    const res = await axios.put(`${url}/${id}`, record);
    return res.data;
  }

  static async deleteRecord(id) {
    const res = await axios.delete(`${url}/${id}`);
    return res.data;
  }
}
