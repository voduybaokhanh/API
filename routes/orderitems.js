var express = require('express');
var router = express.Router();
var orderitemsRouter = require('../models/OrderItem');
var productsRouter = require('../models/Product'); // Đảm bảo import mô hình Product

/**
 * @swagger
 * /orderitem/add:
 *   post:
 *     summary: Thêm một chi tiết sản phẩm
 *     tags: [OrderItem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *               productID:
 *                 type: string
 *               order:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thêm chi tiết sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Thêm thất bại
 */
router.post('/add', async function (req, res, next) {
    try {
        const { quantity, order, productID } = req.body; // Sử dụng productID thay vì product để dễ quản lý
        // Tìm sản phẩm theo productID
        const product = await productsRouter.findById(productID);
        if (!product) {
            return res.status(404).json({ status: false, message: "Sản phẩm không tồn tại" });
        }
        const total_price = product.price * quantity;
        const addItem = { quantity, total_price, order, product: productID }; // Lưu productID chứ không phải object
        await orderitemsRouter.create(addItem);
        res.json({ status: true, message: "Thêm thành công", data: addItem });
    } catch (error) {
        res.json({ status: false, message: "Thêm thất bại", err: error.message });
    }
});

/**
 * @swagger
 * /orderitem/edit:
 *   put:
 *     summary: Sửa chi tiết sản phẩm
 *     tags: [OrderItem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               productID:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sửa chi tiết sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       404:
 *         description: Không tìm thấy chi tiết sản phẩm hoặc sản phẩm
 */
router.put('/edit', async function (req, res, next) {
    try {
        const { id, quantity, productID } = req.body;
        // Tìm chi tiết sản phẩm theo id
        var itemUpdate = await orderitemsRouter.findById(id);
        if (!itemUpdate) {
            return res.status(404).json({ status: false, message: "Chi tiết sản phẩm không tồn tại" });
        }
        // Tìm sản phẩm theo productID
        const product = await productsRouter.findById(productID);
        if (!product) {
            return res.status(404).json({ status: false, message: "Sản phẩm không tồn tại" });
        }
        itemUpdate.quantity = quantity ? quantity : itemUpdate.quantity;
        itemUpdate.total_price = product.price * itemUpdate.quantity; // Cập nhật lại total_price
        itemUpdate.product = productID; // Cập nhật lại product
        await itemUpdate.save();
        res.json({ status: true, message: "Sửa thành công", data: itemUpdate });
    } catch (error) {
        res.json({ status: false, message: "Sửa thất bại", err: error.message });
    }
});

/**
 * @swagger
 * /orderitem/delete:
 *   delete:
 *     summary: Xóa chi tiết sản phẩm
 *     tags: [OrderItem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Xóa chi tiết sản phẩm thành công
 *       404:
 *         description: Không tìm thấy chi tiết sản phẩm
 */
router.delete('/delete', async function (req, res, next) {
    try {
        var id = req.body.id;
        await orderitemsRouter.findByIdAndDelete(id);
        res.json({ status: true, message: "Xóa thành công" });
    } catch (error) {
        res.json({ status: false, message: "Xóa thất bại", err: error.message });
    }
});

/**
 * @swagger
 * /orderitem/get-list-orderitem-with-product:
 *   get:
 *     summary: Lấy danh sách chi tiết sản phẩm với thông tin sản phẩm
 *     tags: [OrderItem]
 *     responses:
 *       200:
 *         description: Trả về danh sách chi tiết sản phẩm và thông tin sản phẩm liên kết
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 *       404:
 *         description: Không tìm thấy
 */
router.get('/get-list-orderitem-with-product', async function (req, res, next) {
    try {
        var data = await orderitemsRouter.find().populate('product');
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

/**
 * @swagger
 * /orderitem/get-list-orderitem-with-order:
 *   get:
 *     summary: Lấy danh sách chi tiết sản phẩm với thông tin đơn hàng
 *     tags: [OrderItem]
 *     responses:
 *       200:
 *         description: Trả về danh sách chi tiết sản phẩm và thông tin đơn hàng liên kết
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 *       404:
 *         description: Không tìm thấy
 */
router.get('/get-list-orderitem-with-order', async function (req, res, next) {
    try {
        var data = await orderitemsRouter.find().populate('order');
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

module.exports = router;
