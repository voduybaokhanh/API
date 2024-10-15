var express = require('express');
var router = express.Router();
var sendMail = require("../utils/configMail");
var usersRouter = require('../models/User');
const JWT = require('jsonwebtoken');
const config = require('../utils/configENV');
const authenticateToken = require('./authMiddleware'); // Import middleware

/**
 * @swagger
 * /user/list:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 */
router.get('/list', authenticateToken, async function (req, res, next) {
    var data = await usersRouter.find();
    res.json({ status: true, data });
});

/**
 * @swagger
 * /user/send-mail:
 *   post:
 *     summary: Gửi email
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *               subject:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gửi mail thành công
 *       400:
 *         description: Gửi mail thất bại
 */
router.post("/send-mail", authenticateToken, async function (req, res, next) {
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

// Sử dụng middleware cho các route khác
router.post('/add', authenticateToken, async function (req, res, next) {
    try {
        const { name, email, password } = req.body;
        const addItem = { name, email, password };
        await usersRouter.create(addItem);
        res.json({ status: true, message: "Thêm thành công" });
    } catch (error) {
        res.json({ status: false, message: "Thêm thất bại", err: error.message });
    }
});

router.put('/edit', authenticateToken, async function (req, res, next) {
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

router.delete('/delete', authenticateToken, async function (req, res, next) {
    try {
        var id = req.body.id;
        await usersRouter.findByIdAndDelete(id);
        res.json({ status: true, message: "Xóa thành công" });
    } catch (error) {
        res.json({ status: false, message: "Xóa thất bại", err: err });
    }
});

module.exports = router;
