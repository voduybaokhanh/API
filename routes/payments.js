var express = require('express');
var router = express.Router();
var paymentsModel = require("../models/Payment");

//thêm payment với payment_date là now
//localhost:3000/payment/add
router.post('/add', async function (req, res, next) {
    try {
        const { order, payment_date, payment_method, payment_status } = req.body;
        const addItem = { order, payment_date, payment_method, payment_status };
        await paymentsModel.create(addItem);
        res.json({ status: true, message: "Thêm thành công" });
    } catch (error) {
        res.json({ status: false, message: "Thêm thất bại", err: err });
    }
});

//Lấy toàn bộ danh sách payment
//localhost:3000/payment/list
router.get('/list', async function (req, res, next) {
    try {
        var data = await paymentsModel.find();
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

//Lấy danh sách payment theo trạng thái
//localhost:3000/payment/list-status
router.get('/list-status', async function (req, res, next) {
    try {
        const { payment_status } = req.query;
        var data = await paymentsModel.find({ payment_status });
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "Không tìm thấy" ,err:error.message});
    }
});

//Lấy thông tin khóa ngoại
//localhost:3000/payment/list-payment-with-order
router.get('/list-payment-with-order', async function (req, res, next) {
    try {
        var data = await paymentsModel.find().populate('order');
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

// Tự động sửa trạng thái "paid" khi đã thanh toán thành công
// localhost:3000/payment/edit
router.put('/edit', async function (req, res, next) {
    try {
        const { id } = req.body;
        var itemUpdate = await paymentsModel.findByIdAndUpdate(
            id,
            { payment_status: 'paid' },  // Cập nhật payment_status
            { new: true }  // Trả về tài liệu đã cập nhật
        );
        if (itemUpdate) {
            res.json({ status: true, message: "Sửa thành công", data: itemUpdate });
        } else {
            res.json({ status: false, message: "Không tìm thấy đơn thanh toán" });
        }
    } catch (error) {
        res.json({ status: false, message: "Sửa thất bại", error: error.message });
    }
});

//Tự động sửa trạng thái "failed" nếu payment "pending" 1 ngày
//localhost:3000/payment/auto-failed
//đang test
router.put('/auto-failed', async function (req, res, next) {
    try {
        var date = new Date();
        date.setDate(date.getDate() - 1); // Lấy ngày hôm qua
        var itemUpdate = await paymentsModel.updateMany(
            { payment_status: 'pending', payment_date: { $lt: date } },
            { payment_status: 'failed' }
        );
        res.json({ status: true, message: "Sửa thành công", data: itemUpdate });
    } catch (error) {
        res.json({ status: false, message: "Sửa thất bại", error: error.message });
    }
});

//Thủ công payment failed
//localhost:3000/payment/manual-failed
router.put('/manual-failed', async function (req, res, next) {
    try {
        const { id } = req.body;
        var itemUpdate = await paymentsModel.findByIdAndUpdate(id);
        if (itemUpdate) {
            itemUpdate.payment_status = 'failed';
            await itemUpdate.save();
            res.json({ status: true, message: "Sửa thành công", data: itemUpdate });
        } else {
            res.json({ status: false, message: "Không tìm thấy đơn thanh toán" });
        }
    } catch (error) {
        res.json({ status: false, message: "Sửa thất bại", error: error.message });
    }
});

//Xóa payment
//localhost:3000/payment/delete
router.delete('/delete', async function (req, res, next) {
    try {
        var id = req.body.id;
        await paymentsModel.findByIdAndDelete(id);
        res.json({ status: true, message: "Xóa thành công" });
    } catch (error) {
        res.json({ status: false, message: "Xóa thất bại", err: error.message });
    }
});

module.exports = router;