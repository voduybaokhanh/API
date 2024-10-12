var express = require("express");
var router = express.Router();
var productModel = require("../models/Product");
var upload = require("../utils/configMulter");
const JWT = require('jsonwebtoken');
const config = require('../utils/configENV')

/**
 * @swagger
 * /product/list:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     responses:
 *       400:
 *         description: Lỗi server, sai gì đó
 *       200:
 *         description: Trả về danh sách sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/list", async function (req, res, next) {
    var data = await productModel.find();
    res.json({ status: true, data });
});

/**
 * @swagger
 * /product/data:
 *   get:
 *     summary: Lấy dữ liệu theo query string
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên của người dùng
 *       - in: query
 *         name: age
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tuổi của người dùng
 *     responses:
 *       200:
 *         description: Trả về thông tin người dùng
 */
//localhost:3000/data
router.get("/data", function (req, res) {
    const { name, age } = req.query;
    res.json({ ten: name, tuoi: age });
});

/**
 * @swagger
 * /product/data/{name}/{age}:
 *   get:
 *     summary: Lấy dữ liệu theo params
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên của người dùng
 *       - in: path
 *         name: age
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tuổi của người dùng
 *     responses:
 *       200:
 *         description: Trả về thông tin người dùng
 */
router.get("/data/:name/:age", function (req, res) {
    const { name, age } = req.params;
    res.json({ ten: name, tuoi: age });
});

/**
 * @swagger
 * /product/data:
 *   post:
 *     summary: Lấy dữ liệu theo body
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên của người dùng
 *               age:
 *                 type: integer
 *                 description: Tuổi của người dùng
 *     responses:
 *       200:
 *         description: Trả về thông tin người dùng
 */
router.post("/data", function (req, res) {
    const { name, age } = req.body;
    res.json({ ten: name, tuoi: age });
});

/**
 * @swagger
 * /product/detail:
 *   get:
 *     summary: Lấy chi tiết sản phẩm theo id
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết sản phẩm
 */
router.get("/detail", async function (req, res) {
    try {
        const authHeader = req.header("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(' ')[1];
            JWT.verify(token, config.SECRETKEY, async function (err, decoded) {
                if (err) {
                    res.status(403).json({ status: 403, message: "Token không hợp lệ", error: err });
                } else {
                    const productId = req.query.id;
                    if (!productId) {
                        return res.status(400).json({ status: false, message: "Thiếu ID sản phẩm" });
                    }
                    const data = await productModel.findById(productId);
                    if (!data) {
                        return res.status(404).json({ status: false, message: "Sản phẩm không tồn tại" });
                    }
                    res.json({ status: true, data });
                }
            });
        } else {
            res.status(401).json({ status: 401, message: "Thiếu token xác thực" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi máy chủ", error });
    }
});


/**
 * @swagger
 * /product/list-product-with-category:
 *   get:
 *     summary: Lấy danh sách sản phẩm kèm theo thông tin khóa ngoại category
 *     responses:
 *       200:
 *         description: Trả về danh sách sản phẩm kèm theo thông tin category
 */
router.get("/list-product-with-category", async function (req, res, next) {
    try {
        var data = await productModel.find().populate("category");
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

/**
 * @swagger
 * /product/list-category:
 *   get:
 *     summary: Lấy danh sách sản phẩm theo category
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của category
 *     responses:
 *       200:
 *         description: Trả về danh sách sản phẩm theo category
 *       400:
 *         description: Thêm sản phẩm thất bại
 */
router.get("/list-category", async function (req, res, next) {
    try {
        const { id } = req.query;
        var data = await productModel.find({ category: id });
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

/**
 * @swagger
 * /product/add:
 *   post:
 *     summary: Thêm sản phẩm mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               image:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thêm sản phẩm thành công
 *       400:
 *         description: Thêm sản phẩm thất bại
 */
router.post("/add", async function (req, res, next) {
    try {
        const { name, price, quantity, image, category } = req.body;
        const newProduct = { name, price, quantity, image, category };
        await productModel.create(newProduct);
        res.json({ status: true, message: "Thêm sản phẩm thành công" });
    } catch (err) {
        res.json({
            status: false,
            message: "Thêm sản phẩm thất bại",
            error: err.message,
        });
    }
});

/**
 * @swagger
 * /product/edit:
 *   post:
 *     summary: Sửa sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               image:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sửa sản phẩm thành công
 *       400:
 *         description: Sửa sản phẩm thất bại
 *
 */
router.post("/edit", async function (req, res, next) {
    try {
        const { id, name, price, quantity, image, category } = req.body;
        var item = await productModel.findById(id);
        if (item) {
            item.name = name || item.name;
            item.price = price || item.price;
            item.quantity = quantity || item.quantity;
            item.image = image || item.image;
            item.category = category || item.category;
            await item.save();
            res.json({ status: true, message: "Sửa sản phẩm thành công" });
        } else {
            res.json({ status: false, message: "Không tìm thấy sản phẩm" });
        }
    } catch (err) {
        res.json({ status: false, message: "Sửa sản phẩm thất bại" });
    }
});

/**
 * @swagger
 * /product/delete:
 *   delete:
 *     summary: Xóa sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID của sản phẩm cần xóa
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 *       400:
 *         description: Xóa sản phẩm thất bại
 */
router.delete("/delete", async function (req, res, next) {
    try {
        var id = req.body.id;
        await productModel.findByIdAndDelete(id);
        res.json({ status: true, message: "Xóa sản phẩm thành công" });
    } catch (err) {
        res.json({ status: false, message: "Xóa sản phẩm thất bại" });
    }
});

module.exports = router;
