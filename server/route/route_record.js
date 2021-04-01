const express = require("express");
const API = require("../api/api_record");
const router = express.Router();

router.get("/all", API.getAllRecordsIncludesDeletion);
router.get("/category=:cid", API.getAllRecordsByCategory);
router.get("/", API.getAllRecords);
router.get("/:id", API.getRecordById);
router.post("/", API.createRecord);
router.put("/:id", API.updateRecord);
router.delete("/:id", API.deleteRecord);

module.exports = router;
