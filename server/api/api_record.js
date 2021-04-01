const Record = require("../model/model_record");

module.exports = class API {
  static async getAllRecordsIncludesDeletion(req, res) {
    try {
      const records = await Record.find({});

      res.status(200).json(records);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  static async getAllRecordsByCategory(req, res) {
    const cid = req.params.cid;

    try {
      const records = await Record.find({
        category: cid,
        deletionFlag: false,
      });

      res.status(200).json(records);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  static async getAllRecords(req, res) {
    try {
      const records = await Record.find({
        deletionFlag: false,
      });

      res.status(200).json(records);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  static async getRecordById(req, res) {
    const id = req.params.id;

    try {
      const record = await Record.find({
        _id: id,
        deletionFlag: false,
      });

      res.status(200).json(record);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  static async createRecord(req, res) {
    const record = req.body;

    await Record.create(record, (err, doc) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(201).json(doc);
      }
    });
  }

  static async updateRecord(req, res) {
    const id = req.params.id;
    const record = req.body;

    try {
      await Record.updateOne(
        {
          _id: id,
          deletionFlag: false,
        },
        record
      );

      res.status(200).json({ message: "Record updated!" });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  static async deleteRecord(req, res) {
    const id = req.params.id;

    try {
      await Record.findByIdAndUpdate(id, { deletionFlag: true });

      res.status(200).json({ message: "Record deleted!" });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
};
