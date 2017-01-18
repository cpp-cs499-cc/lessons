var express = require('express')
var webshot = require('webshot')
var sharp = require('sharp')
var AWS = require('aws-sdk')
const uuidV1 = require('uuid/v1');
var fs = require('fs')
var s3 = new AWS.S3();

// For details and examples about AWS Node SDK,
// please see https://aws.amazon.com/sdk-for-node-js/

var myBucket = 'screenshot-499';
var app = express()

// This is how your enable CORS for your web service
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  res.sendfile('index.html')
})

app.get('/list', function(req, res){
	var params = {
	  Bucket: myBucket	  
	};
	s3.listObjects(params, 	function(err, data){	  
	  for(var i = 0; i < data.Contents.length; i++) {
	  	data.Contents[i].Url = 'https://s3-us-west-1.amazonaws.com/' + data.Name + '/' + data.Contents[i].Key;
	  }	  
	  res.send(data.Contents);
	})
})

app.get('/screenshot', function (req, res) {
  if (req.query.url) {
  	  console.log("Getting screenshot for " + req.query.url);

  	  var fileId = uuidV1();
  	  var fileNameFullsize = fileId + ".jpeg";
  	  var fileName512 = fileId + "-512.jpeg";
  	  var fileName256 = fileId + "-256.jpeg";

	  webshot(req.query.url, fileNameFullsize, function(err) {
	    // screenshot now saved to google.jpeg
	    if (err) {
	    	console.log("Failed to get the screenshot", err);
	    } else {
	    	console.log("Screenshot done.");	    	
	    	sharp(fileNameFullsize)
			  .resize(512, 384)
			  .toFile(fileName512, (err, info) => {
			  	  if (err) {
			  	  	console.log("err: ", err);	
			  	  } else {
			  	  	console.log("Resize the image to 512: ", info);
			  	  	uploadFileToS3(fileName512);
			  	  }			     			      
			  });
			sharp(fileNameFullsize)
			  .resize(256, 192)
			  .toFile(fileName256, (err, info) => {
			      if (err) {
			  	  	console.log("err: ", err);	
			  	  } else {
			  	  	console.log("Resize the image to 256: ", info);
			  	  	uploadFileToS3(fileName256);
			  	  }
			  });
			uploadFileToS3(fileNameFullsize);
		}
	  });

	  var result = {
	  	id : fileId, 
	  	fullsize : 'https://s3-us-west-1.amazonaws.com/' + myBucket + '/' + fileNameFullsize,
	  	size1 : 'https://s3-us-west-1.amazonaws.com/' + myBucket + '/' + fileName512,
	  	size2 : 'https://s3-us-west-1.amazonaws.com/' + myBucket + '/' + fileName256
	  }
	  res.send(result);
  }  
})

function uploadFileToS3(imageFilePath) {
	fs.readFile(imageFilePath, function (err, data) {
		params = {Bucket: myBucket, Key: imageFilePath, Body: data, ACL: "public-read", ContentType: "image/png"};
	    s3.putObject(params, function(err, data) {
	         if (err) {
	             console.log(err)
	         } else {
	             console.log("Successfully uploaded data to " + myBucket, data);
	             fs.unlink(imageFilePath);
	         }
	    });
	});
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})