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
        res.json({ status: false, message: "Thêm thất bại", err: err });
    }
});

//sửa category
//localhost:3000/category/edit
router.post('/edit', async function (req, res, next) {
    try {
        const { id, name, image } = req.body;
        var itemUpdate = await categoryModel.findById(id);
        if (itemUpdate) {
            itemUpdate.name = name ? name : itemUpdate;
            itemUpdate.image = image ? image : itemUpdate;
            await itemUpdate.save();
            res.json({ status: true, message: "Sửa thành công" });
        } else {
            res.json({ status: false, message: "Không tìm thấy" });
        }
    } catch (error) {
        res.json({ status: false, message: "Sửa thất bại" });
    }
});

//xóa category
//localhost:3000/category/delete
router.delete('/delete', async function (req, res, next) {
    try {
        var id = req.body.id;
        await categoryModel.findByIdAndDelete(id);
        res.json({ status: true, message: "Xóa thành công" });
    } catch (error) {
        res.json({ status: false, message: "Xóa thất bại", err: err });
    }
});

module.exports = router;