var express = require('express');
var router = express.Router();
var paymentsModel = require("../models/Payment");

/**
 * @swagger
 * /payment/add:
 *   post:
 *     summary: Thêm một payment mới
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       200:
 *         description: Thêm thành công
 *       400:
 *         description: Thêm thất bại
 */
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

/**
 * @swagger
 * /payment/list:
 *   get:
 *     summary: Lấy toàn bộ danh sách thanh toán
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Trả về danh sách các thanh toán
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Không tìm thấy
 */
router.get('/list', async function (req, res, next) {
    try {
        var data = await paymentsModel.find();
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

/**
 * @swagger
 * /payment/list-status:
 *   get:
 *     summary: Lấy danh sách thanh toán theo trạng thái
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: payment_status
 *         schema:
 *           type: string
 *         required: true
 *         description: Trạng thái thanh toán cần tìm
 *     responses:
 *       200:
 *         description: Trả về danh sách các thanh toán theo trạng thái
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Không tìm thấy
 */
router.get('/list-status', async function (req, res, next) {
    try {
        const { payment_status } = req.query;
        var data = await paymentsModel.find({ payment_status });
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "Không tìm thấy" ,err:error.message});
    }
});

/**
 * @swagger
 * /payment/list-payment-with-order:
 *   get:
 *     summary: Lấy danh sách thanh toán và thông tin đơn hàng liên kết
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Trả về danh sách thanh toán và thông tin đơn hàng liên kết
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Không tìm thấy
 */
router.get('/list-payment-with-order', async function (req, res, next) {
    try {
        var data = await paymentsModel.find().populate('order');
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

/**
 * @swagger
 * /payment/edit:
 *   put:
 *     summary: Sửa trạng thái thanh toán thành "paid"
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID của thanh toán
 *     responses:
 *       200:
 *         description: Sửa thành công
 *       404:
 *         description: Không tìm thấy đơn thanh toán
 */
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

/**
 * @swagger
 * /payment/auto-failed:
 *   put:
 *     summary: Tự động sửa trạng thái thành "failed" nếu thanh toán "pending" hơn 1 ngày
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Sửa thành công
 *       400:
 *         description: Sửa thất bại
 */
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

/**
 * @swagger
 * /payment/manual-failed:
 *   put:
 *     summary: Thủ công sửa trạng thái thành "failed"
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID của thanh toán
 *     responses:
 *       200:
 *         description: Sửa thành công
 *       404:
 *         description: Không tìm thấy đơn thanh toán
 */
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

/**
 * @swagger
 * /payment/delete:
 *   delete:
 *     summary: Xóa một thanh toán
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID của thanh toán
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy thanh toán
 */
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