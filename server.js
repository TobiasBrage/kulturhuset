const express    = require('express');
const app        = express();
const path       = require('path');
const bodyParser = require('body-parser');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require("./routes/index") (app);
require("./routes/events") (app);

app.use(express.static('public'));

const port = 3000;
app.listen(port);
console.log(`Server started http://localhost:${port}`);