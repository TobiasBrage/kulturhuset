module.exports = function (app) {

  app.get('/admin', function (req, res) {
    if (req.session.userId == null) {
      res.render('pages/admin', {
        showLogin: true,
        showInfo: false,
        showLogud: req.session.userId,
      });
    } else {

      let sql2 = 'SELECT * FROM aabningstider';
      let sql3 = 'SELECT * FROM ansatte';
      let sql4 = 'SELECT * FROM booking';
      let sql5 = 'SELECT * FROM priser';
      let sql6 = 'SELECT * FROM produkter';

      db.query(sql2, [], function (err, aabningstider) {
      db.query(sql3, [], function (err, ansatte) {
      db.query(sql4, [], function (err, booking) {
      db.query(sql5, [], function (err, priser) {
      db.query(sql6, [], function (err, produkter) {

        res.render('pages/admin', {
          showLogin: false,
          showInfo: true,
          showLogud: req.session.userId,
          user: req.session.user,
          aabningstider: aabningstider,
          ansatte: ansatte,
          booking: booking,
          priser: priser,
          produkter: produkter
        });
      }) // sql6 ends here
      }) // sql5 ends here
      }) // sql4 ends here
      }) // sql3 ends here
      }) // sql2 ends here
    }
	});

  // ================================================================

	app.post('/admin', function (req, res) {

		let message = '';
		let sess = req.session;

		let post = req.body;
		let brugernavn = post.brugernavn;
		let kodeord = post.kodeord;

		let sql = 'SELECT * FROM admin WHERE brugernavn = ? AND kodeord = ?';

		db.query(sql, [brugernavn, kodeord], function (err, bruger) {

			if (bruger.length) {
				req.session.userId = bruger[0].id;
				req.session.user = bruger[0];

		    res.redirect('/admin');
			}
			else {
				message = 'Noget gik galt! prøv igen';
				res.render('pages/admin', {
          showLogin: true,
          showInfo: false,
					message: message,
					messageType: 'alert-danger'
				});
			}
		}); // sql1 ends here
	});

	// ================================================================

	app.get('/logout', function (req, res) {
		req.session.destroy(function (err) {
			res.redirect('/');
		});
	});

	// ================================================================

} // End of: module.exports
