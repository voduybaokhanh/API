const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// Định nghĩa schema cho trường hợp phạt nguội
const fineSchema = new Schema({
    id: { type: ObjectId },
    bien_so: { type: String, required: true }, // Biển số xe
    thong_tin: { type: String, required: true }, // Thông tin phạt nguội
    status: { type: String, default: '0' } // Trạng thái xử lý, mặc định là '0'
});

// Xuất mô hình để sử dụng trong phần khác của ứng dụng
module.exports = mongoose.models.Fine || mongoose.model('Fine', fineSchema);
