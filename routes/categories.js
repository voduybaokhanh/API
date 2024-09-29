var express = require('express');
var router = express.Router();

var categoryModel = require("../models/Category");

//localhost:3000/category/add
router.post('/add', async function (req, res, next) {
    try {
        const { name, image } = req.body;
        const addItem = { name, image };
        await categoryModel.create(addItem);
        res.json({ status: true, message: "Thêm thành công" });
    } catch (error) {
        res.json({ status: false, message: "Thêm thất bại" });
    }
})
    
module.exports = router;