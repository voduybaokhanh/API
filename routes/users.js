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

    const mailOptions = {
      from: "khanhvo908@gmail.com",
      to: to,
      subject: subject,
      html: content
    };
    await sendMail.transporter.sendMail(mailOptions);
    res.json({ status: true, message: "Gửi mail thành công" });
  } catch (err) {
    res.json({ status: false, message: "Gửi mail thất bại", err: err });
  }
});

module.exports = router;