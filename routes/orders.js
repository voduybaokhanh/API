var express = require('express');
var router = express.Router();
var ordersRouter = require('../models/Order');

/**
 * @swagger
 * /order/getall/{id}:
 *   get:
 *     summary: Lấy tất cả đơn hàng của người dùng
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Trả về danh sách đơn hàng của người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: Không tìm thấy
 */
router.get('/getall/:id', async function (req, res, next) {
    try {
        var orders = await ordersRouter.find({ user: req.params.id });
        res.json({ status: true, data: orders });
    } catch (error) {
        res.json({ status: false, message: "Lỗi lấy dữ liệu" });
    }
});

/**
 * @swagger
 * /order/getall:
 *   get:
 *     summary: Lấy tất cả đơn hàng
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Trả về danh sách tất cả các đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: Không tìm thấy
 */
router.get('/getall', async function (req, res, next) {
    try {
        var orders = await ordersRouter.find();
        res.json({ status: true, data: orders });
    } catch (error) {
        res.json({ status: false, message: "Lỗi lấy dữ liệu" });
    }
});

/**
 * @swagger
 * /order/get-list-order-with-user:
 *   get:
 *     summary: Lấy danh sách đơn hàng và thông tin người dùng liên kết
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Trả về danh sách đơn hàng và thông tin người dùng liên kết
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: Không tìm thấy
 */
router.get('/get-list-order-with-user', async function (req, res, next) {
    try {
        var data = await ordersRouter.find().populate('user');
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

/**
 * @swagger
 * /order/add:
 *   post:
 *     summary: Thêm một đơn hàng mới
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Thêm thành công
 *       400:
 *         description: Thêm thất bại
 */
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

/**
 * @swagger
 * /order/delete:
 *   delete:
 *     summary: Xóa một đơn hàng
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
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