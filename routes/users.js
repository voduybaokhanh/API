var express = require('express');
var router = express.Router();
var sendMail = require("../utils/configMail");
var usersRouter = require('../models/User');
const JWT = require('jsonwebtoken');
const config = require('../utils/configENV')


//lấy danh sách user
//localhost:3000/user/list
router.get('/list', async function (req, res, next) {
    var data = await usersRouter.find();
    res.json({ status: true, data });
});

//gửi mail
//localhost:3000/user/send-mail
router.post("/send-mail", async function (req, res, next) {
    try {
        const { to, subject, content } = req.body;

        // Mẫu HTML cho email
        const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  background-color: #007bff;
                  padding: 10px;
                  color: white;
                  border-radius: 10px 10px 0 0;
              }
              .content {
                  margin: 20px 0;
                  color: #333;
                  line-height: 1.6;
              }
              .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #999;
                  margin-top: 20px;
              }
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Thông báo từ công ty FPT</h1>
              </div>
              <div class="content">
                  <p>Xin chào,</p>
                  <p>Chúng tôi muốn gửi đến bạn thông báo quan trọng đã trúng 500tr về <strong>${subject}</strong>.</p>
                  <p>${content}</p>
              </div>
              <div class="footer">
                  <p>Đây là mail tự động, đừng rep.</p>
              </div>
          </div>
      </body>
      </html>
    `;

        const mailOptions = {
            from: "khanhvo908@gmail.com",
            to: to,
            subject: subject,
            html: htmlContent
        };

        await sendMail.transporter.sendMail(mailOptions);
        res.json({ status: true, message: "Gửi mail thành công" });
    } catch (err) {
        res.json({ status: false, message: "Gửi mail thất bại", err: err });
    }
});

//thêm user
//localhost:3000/user/add
router.post('/add', async function (req, res, next) {
    try {
        const { name, email, password } = req.body;
        const addItem = { name, email, password };
        await usersRouter.create(addItem);
        res.json({ status: true, message: "Thêm thành công" });
    } catch (error) {
        res.json({ status: false, message: "Thêm thất bại", err: error.message });
    }
});

//sửa user dạng param
//localhost:3000/user/edit
router.put('/edit', async function (req, res, next) {
    try {
        const { id, name, email, password } = req.body;
        var itemUpdate = await usersRouter.findById(id);
        if (itemUpdate) {
            itemUpdate.name = name ? name : itemUpdate;
            itemUpdate.email = email ? email : itemUpdate;
            itemUpdate.password = password ? password : itemUpdate;
            await itemUpdate.save();
            res.json({ status: true, message: "Sửa thành công" });
        } else {
            res.json({ status: false, message: "Không tìm thấy", err: err });
        }
    } catch (error) {
        res.json({ status: false, message: "Sửa thất bại", err: err });
    }
});

//xóa user
//localhost:3000/user/delete
router.delete('/delete', async function (req, res, next) {
    try {
        var id = req.body.id;
        await usersRouter.findByIdAndDelete(id);
        res.json({ status: true, message: "Xóa thành công" });
    } catch (error) {
        res.json({ status: false, message: "Xóa thất bại", err: err });
    }
});

//sign-in
//localhost:3000/user/sign-in
router.post('/sign-in', async function (req, res, next) {
    try {
        const { email, password } = req.body;
        var user = await usersRouter.findOne({
            email
        });
        if (user) {
            if (user.password === password) {
                //Token người dùng sẽ sử dụng gửi lên trên header mỗi lần muốn gọi api
                const token = JWT.sign({ id: user._id }, config.SECRETKEY, { expiresIn: '30s' });
                //Khi token hết hạn, người dùng sẽ call 1 api khác để lấy token mới
                //Lúc này người dùng sẽ truyền refreshToken lên để nhận về 1 cặp token, refreshToken mới
                //Nếu cả 2 token đều hết hạn người dùng sẽ phải thoát app và đăng nhập lại
                const refreshToken = JWT.sign({ id: user._id }, config.SECRETKEY, { expiresIn: '1h' })
                res.json({ status: true, message: "Đăng nhập thành công", token: token, refreshToken: refreshToken });
            } else {
                res.json({ status: false, message: "Sai mật khẩu" });
            }
        } else {
            res.json({ status: false, message: "Không tìm thấy user" });
        }
    } catch (error) {
        res.json({ status: false, message: "Đăng nhập thất bại", err:err });
    }
});

module.exports = router;
