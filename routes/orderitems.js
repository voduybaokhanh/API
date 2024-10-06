var express = require('express');
var router = express.Router();
var orderitemsRouter = require('../models/OrderItem');
var productsRouter = require('../models/Product'); // Đảm bảo import mô hình Product

// Thêm chi tiết sản phẩm có total_price = price * quantity với price của product
// localhost:3000/orderitem/add
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

// Sửa chi tiết sản phẩm
// localhost:3000/orderitem/edit
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

// Xóa chi tiết sản phẩm
// localhost:3000/orderitem/delete
router.delete('/delete', async function (req, res, next) {
    try {
        var id = req.body.id;
        await orderitemsRouter.findByIdAndDelete(id);
        res.json({ status: true, message: "Xóa thành công" });
    } catch (error) {
        res.json({ status: false, message: "Xóa thất bại", err: error.message });
    }
});

//lấy thông tin khóa ngoại
//localhost:3000/orderitem/get-list-orderitem-with-product
router.get('/get-list-orderitem-with-product', async function (req, res, next) {
    try {
        var data = await orderitemsRouter.find().populate('product');
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

//lấy thông tin khóa ngoại
//localhost:3000/orderitem/get-list-orderitem-with-order
router.get('/get-list-orderitem-with-order', async function (req, res, next) {
    try {
        var data = await orderitemsRouter.find().populate('order');
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

module.exports = router;
