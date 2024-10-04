var express = require('express');
var router = express.Router();
var productModel = require("../models/Product");
var upload = require('../utils/configMulter');

//localhost:3000/product/list
router.get('/list', async function (req, res, next) {
    var data = await productModel.find();
    res.json({ status: true, data });
});

//Lấy danh sách sản phẩm có số lượng dưới 100
//localhost:3000/product/list-duoi-100
router.get('/list-duoi-100', async function (req, res, next) {
    var data = await productModel.find({ quantity: { $lt: 100 } });
    res.json({ status: true, data });
});

//Lấy danh sách sản phẩm có giá trên 5000 và số lượng dưới 50
//localhost:3000/product/list-tren-5000-duoi-50
router.get('/list-tren-5000-duoi-50', async function (req, res, next) {
    var data = await productModel.find({ price: { $gt: 5000 }, quantity: { $lt: 50 } });
    res.json({ status: true, data });
});

//Lấy toàn bộ danh sách sản phẩm thuộc loại "xxx" ( với xxx là do người dùng truyền vào)
//localhost:3000/product/list-category
router.get('/list-category', async function (req, res, next) {
    try {
        const category = req.query;
        var data = await productModel.find
            ({ name: category });
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});


//chuyen theo dang query
//localhost:3000/product/data
router.get('/data', function (req, res) {
    const { name, age } = req.query;
    res.json({ ten: name, tuoi: age });
});

//chuyen theo dang params
//localhost:3000/product/data/FPT/25
router.get("/data/:name/:age", function (req, res) {
    const { name, age } = req.params;
    res.json({ ten: name, tuoi: age });
});

//chuyen theo dang body
//localhost:3000/product/data
router.post("/data", function (req, res) {
    const { name, age } = req.body;
    res.json({ ten: name, tuoi: age });
});

//them vao list
//localhost:3000/product/add
router.post("/add", async function (req, res, next) {
    try {
        const { name, price, quantity, image, category } = req.body;
        const newProduct = { name, price, quantity, image, category };
        await productModel.create(newProduct);
        res.json({ status: true, message: "Thêm sản phẩm thành công" });
    } catch (err) {
        res.json({ status: false, message: "Thêm sản phẩm thất bại", error: err.message });
    }
});


//lay chi tiet trong list
//localhost:3000/product/detail
router.get("/detail", async function (req, res) {
    try {
        var id = req.query.id;
        var data = await productModel.findById(id);
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

//sua chi tiet trong list
//localhost:3000/product/edit
router.post("/edit", async function (req, res, next) {
    try {
        const { id, name, price, quantity, image, category } = req.body;
        var item = await modelProduct.findById(id);
        if (item) {
            item.name = name ? name : item.name;
            item.price = price ? price : item.price;
            item.quantity = quantity ? quantity : item.quantity;
            item.image = image ? image : item.image;
            item.category = category ? category : item.category;
            await item.save();
            res.json({ status: true, message: "Sửa sản phẩm thành công" });
        }
    } catch (err) {
        res.json({ status: false, message: "Sửa sản phẩm thất bại" });
    }
});

//xoa chi tiet trong list
//localhost:3000/product/delete
router.delete("/delete", async function (req, res, next) {
    try {
        var id = req.body.id;
        await productModel.findByIdAndDelete(id);
        res.json({ status: true, message: "Xóa sản phẩm thành công" });
    } catch (err) {
        res.json({ status: false, message: "Xóa sản phẩm thất bại" });
    }
});


//Lấy thông tin khóa ngoại
//localhost:3000/product/list-product-with-category
//chua xong
router.get('/list-product-with-category', async function (req, res, next) {
    try {
        var data = await productModel.find().populate('category');
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

//upload single file
//localhost:3000/product/upload
router.post('/upload', [upload.single('image')],
    async (req, res, next) => {
        try {
            const { file } = req;
            if (!file) {
                return res.json({ status: 0, link: "" });
            } else {
                const url = `http://localhost::3000/images/${file.filename}`;
                return res.json({ status: 1, url: url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({ status: 0, link: "" });
        }
    });

//upload multiple file
//localhost:3000/product/upload-multiple
router.post('/upload-multiple', [upload.array('image', 9)],
    async (req, res, next) => {
        try {
            const { files } = req;
            if (!files) {
                return res.json({ status: 0, link: [] });
            } else {
                const url = [];
                for (const singleFile of files) {
                    url.push(`http://localhost:3000/images/${singleFile.filename}`);
                }
                return res.json({ status: 1, url: url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({ status: 0, link: [] });
        }
    });

module.exports = router;