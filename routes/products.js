var express = require('express');
var router = express.Router();
var productModel = require("../models/Product");
var upload = require('../utils/configMulter');

//localhost:3000/product/list
router.get('/list', async function (req, res, next) {
    var data = await productModel.find();
    res.json({ status: true, data });
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

//Lấy thông tin khóa ngoại
//localhost:3000/product/list-product-with-category
router.get('/list-product-with-category', async function (req, res, next) {
    try {
        var data = await productModel.find().populate('category');
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

//Lấy toàn bộ danh sách sản phẩm thuộc loại "xxx" ( với xxx là do người dùng truyền vào)
//localhost:3000/product/list-category
router.get('/list-category', async function (req, res, next) {
    try {
        const { id } = req.query;
        var data = await productModel.find({ category: id });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay", err: err });
    }
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

//Lấy danh sách sản phẩm có tên chứa chữ "xxx" (với xxx là do người dùng truyền vào)
//localhost:3000/product/list-product-with-name
router.get('/list-product-with-name', async function (req, res, next) {
    try {
        const { name } = req.query;
        var data = await productModel.find({ name: { $regex: name } });
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
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

//Lấy danh sách các sản phẩm có giá từ min đến max (với min và max là 2 số do người dùng truyền vào)
//localhost:3000/product/list-product-with-price
router.get('/list-product-with-price', async function (req, res, next) {
    try {
        const { min, max } = req.query;
        var data = await productModel.find({ price: { $gte: min, $lte: max } });
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay", err: err });
    }
});

//Lấy ra danh sách các sản phẩm thuộc loại xxx và có số lượng lớn hơn yyy (với xxx là id loại và yyy là số lượng do người dùng truyền vào)
//localhost:3000/product/list-product-with-category-quantity
router.get('/list-product-with-category-quantity', async function (req, res, next) {
    try {
        const { id, quantity } = req.query;
        var data = await productModel.find({ category: id, quantity: { $gt: quantity } });
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

//Sắp xếp danh sách sản phẩm theo giá từ thấp đến cao
//localhost:3000/product/list-product-sort-asc
router.get('/list-product-sort-asc', async function (req, res, next) {
    try {
        var data = await productModel.find().sort({ price: 1 });
        res.json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

//Tìm sản phẩm có giá cao nhất thuộc loại xxx (với xxx là id loại do người dùng truyền vào)
//localhost:3000/product/product-max-price
//chua xong 
router.get('/product-max-price', async function (req, res, next) {
    try {
        const { id } = req.query;
        var data = await productModel.findOne({ category: id }).sort({ price: -1 });
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