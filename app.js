const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(PORT, function () {
  console.log('App listening on port !',PORT);
});

