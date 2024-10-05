var express = require('express');
var router = express.Router();
var sendMail = require("../utils/configMail");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//gửi mail
//localhost:3000/users/send-mail
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

module.exports = router;
