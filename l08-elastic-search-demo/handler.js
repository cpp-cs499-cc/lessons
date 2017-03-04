var elasticsearch = require('elasticsearch');
var express = require('express');
var fs = require('fs');

var client = new elasticsearch.Client({
  host: 'https://search-myreviews-efkblmewvmkqu4j7dfkipsxqhy.us-west-1.es.amazonaws.com/',
  log: 'info'
});

client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 5000
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

function loadDataSet() {
  fs.readFile("dataset/data.json", {encoding: 'utf-8'}, function(err,data) {
    if (!err) {      
      var items = JSON.parse(data);
      for(var i = 0; i < 1000; i++) {
        console.log(items[i].id);
        client.create({
          index: '499-books',
          type: 'book',
          id: items[i].id,
          body: items[i]
        }, function (error, response) {
          console.log("put item successfully.")
        })
      }
    } else{
        console.log(err);
    }
  });
}

function searchTest(searchterm, callback) {
  client.search({
    index: '499-books',  
    body: {
      "query": {
        "bool": {
          "must": {
            "match": {
              "keywords": searchterm
            }
          },
          "filter": {
            "range": { "year": { "gte": 2011, "lte": 2013 }}
          }
        }
      }
    }
  }, function (error, response) {
    console.log(response);
    if (callback) {
      callback(response);
    }
  });
}

var app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/search', function (req, res) {  
  searchTest(req.query.q, function(result) {
    res.send(result);
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

