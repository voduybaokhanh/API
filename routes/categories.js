var express = require('express');
var router = express.Router();

var categoryModel = require("../models/Category");


/**
 * @swagger
 * /category/add:
 *   post:
 *     summary: Thêm danh mục mới
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thêm danh mục thành công
 *       400:
 *         description: Thêm thất bại
 */
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

/**
 * @swagger
 * /category/edit:
 *   post:
 *     summary: Sửa danh mục
 *     tags: [Category]
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
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sửa danh mục thành công
 *       404:
 *         description: Không tìm thấy danh mục
 */
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

/**
 * @swagger
 * /category/delete:
 *   delete:
 *     summary: Xóa danh mục
 *     tags: [Category]
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
 *         description: Xóa danh mục thành công
 *       404:
 *         description: Không tìm thấy danh mục
 */
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