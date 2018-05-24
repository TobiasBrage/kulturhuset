const nodemailer = require('nodemailer');

module.exports = function (app) {

    var eventId;
    var stageId;

    app.get('/', function (req, res) {
        let sql = 'SELECT * FROM event ORDER BY date ASC';
        db.query(sql, function (err, result) {
            res.render('pages/index', {
                eventObj: result
            });
        })
    }); // index

    app.get('/login', function (req, res) {
        res.render('pages/login');
    }); // login

    app.get('/cms', function (req, res) {
        res.render('pages/cms');
    }); // cms logged in

    app.get('/booking', function (req, res) {
        eventId = req.query.event;
        let sqlAllEvents = 'SELECT * FROM event ORDER BY date ASC';
        let sqlEvent = 'SELECT * FROM event WHERE id = ?';
        db.query(sqlEvent, [eventId], function (err, eventResult) {
            stageId = eventResult[0].stage;
            db.query(sqlAllEvents, function (err, allEvents) {
                res.render('pages/booking', {
                    eventId: eventId
                });
            })
        })
    }); // booking

    app.get('/bookedSeats', function (req, res) {
        let sqlBookedSeats = 'SELECT * FROM booking_seat WHERE event_id = ?';
        db.query(sqlBookedSeats, [req.query.id], function (err, bookedSeatResult) {
            res.send(bookedSeatResult);
        })
    }); // JSON booked seats

    app.get('/stage', function (req, res) {
        let sqlStage = 'SELECT * FROM stage WHERE id = ?';
        db.query(sqlStage, [stageId], function (err, stageResult) {
            res.send(stageResult);
        })
    }); // JSON stage data

    app.get('/events', function (req, res) {
        let sqlEvents = 'SELECT * FROM event ORDER BY unix ASC';
        db.query(sqlEvents, function (err, eventsResult) {
            res.send(eventsResult);
        })
    }); // JSON stage data

    app.get('/event', function (req, res) {
        let sqlEventData = 'SELECT * FROM event WHERE id = ?';
        db.query(sqlEventData, [req.query.id], function (err, eventDataResult) {
            res.send(eventDataResult);
        })
    }); // JSON event data

    app.post('/cms/login', function (req, res) {
        let username = req.body.username;
        let password = req.body.password;
        let token = req.body.token;
        let sqlFindUser = 'SELECT * FROM cms_user WHERE username = ? AND password = ? LIMIT 1';
        let sqlInsertToken = `INSERT INTO login_token VALUES ('', ?, ?)`;
        let sqlDeleteToken = `DELETE FROM login_token WHERE userId = ?`;
        db.query(sqlFindUser, [username, password], function (err, cmsUserResult) {
            db.query(sqlDeleteToken, [cmsUserResult[0].id], function (err, deleteTokenResult) {
                console.log(deleteTokenResult);
                if(!err) {
                    if(cmsUserResult.length == 1) {
                        db.query(sqlInsertToken, [cmsUserResult[0].id, token], function (err, tokenResult) {
                            if(!err) {
                                res.send(`{"message":"success"}`);
                            }
                        });
                    } else {
                        res.send(`{"message":"no match"}`);
                    }
                }
            });
        });
    }); // POST cms login

    app.post('/booking', function (req, res) {
        let seats = req.body.seats;
        let name = req.body.name;
        let email = req.body.mail;
        let phone = req.body.phone;
        let seatsArray = seats.split(',');
        let insertBookingSql = `INSERT INTO booking VALUES ('', ?, ?, ?, ?, ?, ?)`;
        let lastIdBookingSql = `SELECT id FROM booking ORDER BY id DESC LIMIT 1`;
        let insertSeatSql = `INSERT INTO booking_seat VALUES ('', ?, ?, ?)`;
        let curDate = new Date().getTime();
        let lastBookingId;
        let token = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 255)+new Date().getTime();
        let emailMessage;

        // insert into booking
        db.query(insertBookingSql,[eventId, name, email, phone, curDate, token] ,function (err) {
            if (err) {
                console.log(err);
            } else {
                // get last inserted id from booking
                db.query(lastIdBookingSql ,function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        lastBookingId = data[0].id;
                        seatsArray.forEach(seatId => {
                            // insert into booking_seat
                            db.query(insertSeatSql,[lastBookingId, eventId, seatId] ,function (err) {
                                if (err) {
                                    console.log(err);
                                }
                            })
                        });
                        emailMessage = `Tak for din bestilling ${name}.`;
                        confirmMail(email, emailMessage);
                        res.send({'token':token});
                    }
                })
            }
        })

    }); // POST booking

    app.get('/bookingcomplete', function (req, res) {
        let bookingSql = `SELECT * FROM booking WHERE token = ?`;
        db.query(bookingSql, [req.query.token], function (err, result) {
            res.render('pages/bookingComplete', {
                personName: result[0].name
            });
        })
    }); // booking complete

    app.get('/news', function (req, res) {
        let newsSql = `SELECT * FROM news ORDER BY unix ASC`;
        db.query(newsSql, function (err, result) {
            res.send(result);
        })
    }); // JSON news

    app.post('/newsletter', function (req, res) {
        let email = req.body.email;
        let unix = req.body.unix;
        let token = req.body.token;
        let message = `Tak fordi at du har tilmeldt dig vores nyhedsbrev. \n http://localhost:3000/newsletter/remove?token=${token} klik på linket for at framelde dig.`;
        let insertLetter = `INSERT INTO news_letter VALUES ('', ?, ?, ?)`;
        db.query(insertLetter,[email, unix, token] ,function (err, result) {
            if(err)
                res.send(`{"message":"error", "error":"${err}"}`);
            else
                newsletterMail(`${email}`,message);
                res.send(`{"message":"success"}`);
        })
    }); // POST newsletter

    app.get('/newsletter/remove', function (req, res) {
        let newsRemove = `DELETE FROM news_letter WHERE token = ?`;
        db.query(newsRemove, [req.query.token], function (err, result) {
            if(err)
                console.log(err);
        })
        res.send('Du er nu frameldt vores nyhedsbrev.');
    }); // newsletter remove user
};

function convertDate(dato) {
    dato = dato.toString();
    if(dato.length > 1) {
        return dato;
    } else {
        return `0${dato}`;
    }
}

function confirmMail(mailto, message) {
    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gamerfreaq@gmail.com',
        pass: 'S8J-qpB-d8x-LBW'
    }
    });

    var mailOptions = {
        from: 'kulturhuset@mail.com',
        to: mailto,
        subject: 'Ordre bekræftigelse',
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
}

function newsletterMail(mailto, message) {
    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gamerfreaq@gmail.com',
        pass: 'S8J-qpB-d8x-LBW'
    }
    });

    var mailOptions = {
        from: 'kulturhuset@mail.com',
        to: mailto,
        subject: 'Nyhedsbrev',
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
}