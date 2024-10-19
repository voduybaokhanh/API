var express = require("express");
var router = express.Router();
var examRouter = require("../models/Exam");
var upload = require("../utils/configMulter");


// Add exam
router.post("/add", upload.single("file"), async function (req, res, next) {
    try {
        const { code, date } = req.body;
        if (!req.file) {
            return res.json({ status: false, message: "Không có tệp nào được tải lên" });
        }
        const addExam = {
            code: code,
            link: req.file.path,
            date: date || new Date()
        };
        await examRouter.create(addExam);
        res.json({ status: true, message: "Thêm đề thi thành công" });
    } catch (error) {
        res.json({ status: false, message: "Thêm đề thi thất bại", err: error.message });
    }
});

//Viết API lấy danh sách đề thi theo mã môn học người dùng truyền vào
router.get("/list", async function (req, res, next) {
    try {
        const { code } = req.query;
        var listExam = await examRouter.find({ code: code });
        res.json({ status: true, message: "Lấy danh sách đề thi thành công", data: listExam });
    } catch (error) {
        res.json({ status: false, message: "Lấy danh sách đề thi thất bại", err: error.message });
    }
});

//Viết API cập nhật thông tin đề thi
router.post("/update", upload.single("file"), async function (req, res, next) {
    try {
        const { id, code, date } = req.body;
        if (!id) {
            return res.json({ status: false, message: "Thiếu ID" });
        }
        const currentExam = await examRouter.findById(id);
        if (!currentExam) {
            return res.json({ status: false, message: "Đề thi không tồn tại" });
        }   
        // Cập nhật các thông tin được gửi, nếu không có thì giữ nguyên giá trị cũ
        const updateExam = {
            code: code || currentExam.code,
            link: req.file ? req.file.path : currentExam.link,
            date: date || currentExam.date || new Date()
        };
        // Cập nhật thông tin đề thi
        await examRouter.findByIdAndUpdate(id, updateExam);
        res.json({ status: true, message: "Cập nhật đề thi thành công" });
    } catch (error) {
        res.json({ status: false, message: "Cập nhật đề thi thất bại", err: error.message });
    }
});




module.exports = router;