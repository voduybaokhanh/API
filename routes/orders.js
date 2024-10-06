var express = require('express');
var router = express.Router();
var ordersRouter = require('../models/Order');

//lấy tất cả order của user
//localhost:3000/order/getall/:id
router.get('/getall/:id', async function (req, res, next) {
    try {
        var orders = await ordersRouter.find({ user: req.params.id });
        res.json({ status: true, data: orders });
    } catch (error) {
        res.json({ status: false, message: "Lỗi lấy dữ liệu" });
    }
});

//lấy tất cả order
//localhost:3000/order/getall
router.get('/getall', async function (req, res, next) {
    try {
        var orders = await ordersRouter.find();
        res.json({ status: true, data: orders });
    } catch (error) {
        res.json({ status: false, message: "Lỗi lấy dữ liệu" });
    }
});

//lấy thông tin khóa ngoại
//localhost:3000/order/get-list-order-with-user
router.get('/get-list-order-with-user', async function (req, res, next) {
    try {
        var data = await ordersRouter.find().populate('user');
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

//thêm order với order_date là now
//localhost:3000/order/add
router.post('/add', async function (req, res, next) {
    try {
        const { user, order_date } = req.body;
        const addItem = { user, order_date};
        await ordersRouter.create(addItem);
        res.json({ status: true, message: "Thêm thành công" });
    } catch (error) {
        res.json({ status: false, message: "Thêm thất bại", err: err });
    }
});

//Xóa order
//localhost:3000/order/delete
router.delete('/delete', async function (req, res, next) {
    try {
        var id = req.body.id;
        await ordersRouter.findByIdAndDelete(id);
        res.json({ status: true, message: "Xóa thành công" });
    } catch (error) {
        res.json({ status: false, message: "Xóa thất bại", err: err });
    }
});

module.exports = router;