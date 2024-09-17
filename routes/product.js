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

module.exports = router;