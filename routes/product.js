var express = require('express');
var router = express.Router();

var list = [
    { id: 1, name: 'FPT', age: 25 },
    { id: 2, name: 'Phong', age: 24 },
    { id: 3, name: 'Khanh', age: 23 },
]

//localhost:3000/product/list
router.get('/list', function (req, res, next) {
    res.json(list);
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
router.post("/add", function (req, res) {
    try {
        const { id, name, age } = req.body;
        list.push({ id, name, age });
        res.json({ status: true, message: "them thanh cong" });
    } catch (error) {
        res.json({ status: false, message: "them that bai" });
    }
});

//lay chi tiet trong list
//localhost:3000/product/detail
router.get("/detail", function (req, res) {
    try {
        const { id } = req.query;
        var item = list.find(p => p.id == id);
        res.json({ status: true, data: item });
    } catch (error) {
        res.json({ status: false, message: "khong tim thay" });
    }
});

//sua chi tiet trong list
//localhost:3000/product/edit
router.put("/edit", function (req, res) {
    try {
        const { id, name, age } = req.body;
        var item = list.find(p => p.id == id);
        item.name = name;
        item.age = age;
        res.json({ status: true, message: "sua thanh cong" });
    } catch (error) {
        res.json({ status: false, message: "sua that bai" });
    }
});
module.exports = router;