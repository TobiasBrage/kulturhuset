module.exports = function (app) {

    app.get('/omos', function (req, res) {
        let sql = 'SELECT * FROM ansatte';
        db.query(sql, function (err, ansatte) {
            res.render('pages/omos', {
                ansatte: ansatte,
                showLogud: req
            });
        })
    });

};