var express = require('express');
var router = express.Router();
var vacineModel = require("../models/Vacine");


//Thêm Vacine
router.post('/add', async function (req, res, next) {
    try {
        const { name, national, price } = req.body;
        const newVacine = ({ name, national, price });
        await vacineModel.create(newVacine);
        res.json({ status: true, message: "Thêm Vacine thành công" });
    } catch (err) {
        res.json({
            status: false,
            message: "Thêm Vacine thất bại",
            error: err.message,
        });
    }
});

//Viết API lấy danh sách 03 loại vacine có giá thấp nhất
router.get('/list', async function (req, res, next) {
    try {
        const vacines = await vacineModel.find().sort({ price: 1 }).limit(3);
        res.json({ status: true, data: vacines });
    } catch (err) {
        res.json({
            status: false,
            message: "Lấy danh sách Vacine thất bại",
            error: err.message,
        });
    }
});

//Viết API xóa thông tin một vacine
router.delete('/delete', async function (req, res, next) {
    try {
        const { id } = req.body;
        await vacineModel.findByIdAndDelete(id);
        res.json({ status: true, message: "Xóa Vacine thành công" });
    } catch (err) {
        res.json({
            status: false,
            message: "Xóa Vacine thất bại",
            error: err.message,
        });
    }
});

//Viết API lấy danh sách các loại vacine theo quốc gia, với tên quốc gia là input là người dùng truyền vào
router.get('/list-national/:national', async function (req, res, next) {
    try {
        const { national } = req.params;
        const vacines = await vacineModel.find({ national });
        res.json({ status: true, data: vacines });
    } catch (err) {
        res.json({
            status: false,
            message: "Lấy danh sách Vacine thất bại",
            error: err.message,
        });
    }
});

module.exports = router;