var express = require('express');
var router = express.Router();
var Fine = require("../models/Fine"); // Đảm bảo đường dẫn là chính xác

// API thêm một thông tin phạt nguội mới
router.post('/add', async (req, res) => {
    try {
        const { bien_so, thong_tin, status } = req.body;
        if (!bien_so || !thong_tin) {
            return res.json({ status: false, message: 'Thiếu thông tin' });
        }
        const newFine = {
            bien_so: bien_so,
            thong_tin: thong_tin,
            status: status || '0' // Giá trị mặc định nếu không có status
        };
        await Fine.create(newFine);
        res.json({ status: true, message: 'Thêm thông tin phạt nguội thành công' });
    } catch (error) {
        res.json({ status: false, message: 'Thêm thông tin phạt nguội thất bại', err: error.message });
    }
});

//Viết API lấy danh sách các trường hợp phạt nguội chưa xử lý
//http://localhost:3000/fine/list/0
router.get('/list/:status', async (req, res) => {
    try {
        const { status } = req.params;
        const fines = await Fine.find({ status: status });
        res.json({ status: true, data: fines });
    } catch (error) {
        res.json({ status: false, message: 'Lấy danh sách phạt nguội thất bại', err: error.message });
    }
});


module.exports = router;
