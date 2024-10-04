const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'khanhvo908@gmail.com',
        pass: 'ccytacftrjvmlsrc'
    }
});

module.exports = { transporter };
