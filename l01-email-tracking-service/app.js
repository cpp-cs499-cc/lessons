var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.sendfile('index.html')
})

app.get('/email', function (req, res) {
  console.log("email opened. id: " + req.query.id);
  //res.send('OK');
  res.sendfile('google.png')
})

app.get('/test', function (req, res) {
  res.send('TEST!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})