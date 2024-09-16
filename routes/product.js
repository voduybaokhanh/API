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

//localhost:3000/product/data
//chuyen theo dang query
router.get('/data', function (req, res) {
    const { name, age } = req.query;
    res.json({ ten: name, tuoi: age });
});

//localhost:3000/product/data/FPT/25
//chuyen theo dang params
router.get("/data/:name/:age", function (req, res) {
    const { name, age } = req.params;
    res.json({ ten: name, tuoi: age });
});

//localhost:3000/product/data
//chuyen theo dang body
router.post("/data", function (req, res) {
    const { name, age } = req.body;
    res.json({ ten: name, tuoi: age });
});

module.exports = router;