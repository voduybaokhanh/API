var express = require('express');
var router = express.Router();

var list = [
    //Mã NV, Tên NV, Chức vụ, Phòng Ban, Lương Cơ Bản
    { maNV: 1, tenNV: 'Khanh', chucvu: 'BE', phongban: 'IT', luongcoban: 100000 },
    { maNV: 2, tenNV: 'Ngoc', chucvu: 'FE', phongban: 'IT', luongcoban: 2000 },
    { maNV: 3, tenNV: 'Linh', chucvu: 'FL', phongban: 'CC', luongcoban: 300000 },
    { maNV: 4, tenNV: 'Tam', chucvu: 'Leader', phongban: 'BB', luongcoban: 4000 },
    { maNV: 5, tenNV: 'Suong', chucvu: 'SP', phongban: 'MKT', luongcoban: 5000 },
]

//Lấy thông tin toàn bộ danh sách nhân viên có trong databse
//localhost:3000/worker/list
router.get('/list', function (req, res, next) {
    res.json(list);
});


//Lấy thông tin chi tiết của một nhân viên thông qua ID (sử dụng params)
//localhost:3000/worker/detail
router.get("/detail/:maNV", function (req, res) {
    try {
        const { maNV } = req.params;
        var item = list.find(p => p.maNV == maNV);

        if (item) {
            res.json({ status: true, data: item });
        } else {
            res.json({ status: false, message: "Không tìm thấy nhân viên" });
        }
    } catch (error) {
        res.json({ status: false, message: "Có lỗi xảy ra" });
    }
});

//Thêm một thông tin nhân viên mới (body)
//localhost:3000/worker/add
router.post("/add", function (req, res) {
    try {
        const { maNV, tenNV, chucvu, phongban, luongcoban } = req.body;
        list.push({ maNV, tenNV, chucvu, phongban, luongcoban });
        res.json({ status: true, message: "them thanh cong" });
    } catch (error) {
        res.json({ status: false, message: "them that bai" });
    }
})

//Thay đổi thông tin của một nhân viên thông qua ID (sử dụng query để truyền ID)
//localhost:3000/worker/update
router.put("/update", function (req, res) {
    try {
        const { maNV, tenNV, chucvu, phongban, luongcoban } = req.query;
        var item = list.find(p => p.maNV == maNV); // Tìm nhân viên với id = maNV

        if (item) {
            item.tenNV = tenNV;
            item.chucvu = chucvu;
            item.phongban = phongban;
            item.luongcoban = luongcoban;
            res.json({ status: true, message: "Cập nhật thành công" });
        } else {
            res.json({ status: false, message: "Không tìm thấy nhân viên" });
        }
    } catch (error) {
        res.json({ status: false, message: "Có lỗi xảy ra" });
    }
});

//Lấy thông tin toàn bộ nhân viên thuộc 1 phòng
//localhost:3000/worker/phongban
router.get("/phongban", function (req, res) {
    try {
        const { phongban } = req.query;
        var item = list.filter(p => p.phongban == phongban); // Lọc nhân viên theo phòng ban

        if (item) {
            res.json({ status: true, data: item });
        } else {
            res.json({ status: false, message: "Không tìm thấy nhân viên" });
        }
    } catch (error) {
        res.json({ status: false, message: "Có lỗi xảy ra" });
    }
});

//Lấy thông tin toàn bộ nhân viên có lương cơ bản trên 5M (5M sẽ truyền bằng query)
//localhost:3000/worker/luongcoban
router.get("/luongcoban", function (req, res) {
    try {
        const { luongcoban } = req.query;
        var item = list.filter(p => p.luongcoban > luongcoban);

        if (item) {
            res.json({ status: true, data: item });
        } else {
            res.json({ status: false, message: "Không tìm thấy nhân viên" });
        }
    } catch (error) {
        res.json({ status: false, message: "Có lỗi xảy ra" });
    }
});

module.exports = router;