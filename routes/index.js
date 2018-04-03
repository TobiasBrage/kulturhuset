// const nodemailer = require('nodemailer');

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('pages/index', {
            message: 'message'
        });
    });

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'gamerfreaq@gmail.com',
//         pass: 'S8J-qpB-d8x-LBW'
//     }
// });

// var mailOptions = {
//     from: 'kage@gmail.com',
//     to: 'tobiasbrage@me.com',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
// });

};