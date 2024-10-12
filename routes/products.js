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
 *     tags: [Product]
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
 *     tags: [Product]
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
 *     tags: [Product]
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
 *     tags: [Product]
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
 *     tags: [Product]
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
//lấy chi tiết sản phẩm với token
router.get("/detail", async function (req, res) {
    try {
        const token = req.header("Authorization")?.split(' ')[1];
        console.log("Token:", token); // Thêm dòng log để kiểm tra token
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (error, productId) {
                if (error) {
                    return res.json({ status: false, message: "Chưa có token: " + error.message });
                } else {
                    // Xử lý chức năng API
                    var productId = req.query.id;
                    if (!productId) {
                        return res.json({ status: false, message: "Sai ID 1" });
                    }

                    var data = await productModel.findById(productId);
                    if (!data) {
                        return res.json({ status: false, message: "Không tìm thấy sản phẩm" });
                    }

                    res.json({ status: true, data });
                }
            });
        } else {
            res.json({ status: false, message: "Sai ID 2" });
        }
    } catch (error) {
        res.json({ status: false, message: "Có lỗi xảy ra: " + error.message });
    }
});





/**
 * @swagger
 * /product/list-product-with-category:
 *   get:
 *     summary: Lấy danh sách sản phẩm kèm theo thông tin khóa ngoại category
 *     tags: [Product]
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
 *     tags: [Product]
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
 *     tags: [Product]
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
 *     tags: [Product]
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
 *     tags: [Product]
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
