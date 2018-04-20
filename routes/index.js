// const nodemailer = require('nodemailer');

module.exports = function (app) {

    app.get('/', function (req, res) {
        let sql = 'SELECT * FROM event ORDER BY date ASC';
        db.query(sql, function (err, result) {
            res.render('pages/index', {
                eventObj: result
            });
        })
    });

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'gmail',
//         pass: 'password'
//     }
// });

// var mailOptions = {
//     from: 'frommail',
//     to: 'tomail',
//     subject: 'subject,
//     text: 'content'
// };

// transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
// });

};