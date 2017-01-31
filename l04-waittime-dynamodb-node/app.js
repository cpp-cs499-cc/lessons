	var request = require('request');
	var parseString = require('xml2js').parseString;
	var AWS = require('aws-sdk');

	AWS.config.update({
	  region: "us-west-1"
	});

	var docClient = new AWS.DynamoDB.DocumentClient();
	var table = "us_waiting_time";

	function fetchWaitingtimes() {
		request('http://www.universalstudioshollywood.com/waittimes/?type=all&site=USH', function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    // console.log(body);
			parseString(body, function (err, result) {
			    // console.dir(result.rss.channel[0].item);
			    var items = result.rss.channel[0].item;
			    for(var i = 0; i < items.length; i++) {
			    	console.log(items[i].title[0], items[i].description[0]);
			    }
			});
		  }
		})
	}

	function putItem(rideName, waittime) {
		var params = {
		    TableName:table,
		    Item:{
		        "rideName": rideName,
		        "timestamp": Date.now(),
		        "waittime": waittime
		    }
		};

		console.log("Adding a new item...");
		docClient.put(params, function(err, data) {
		    if (err) {
		        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
		    } else {
		        console.log("Added item:", JSON.stringify(data, null, 2));
		    }
		});				
	}

	function queryWaitingtime(rideName) {
		var params = {
		    TableName : table,
		    KeyConditionExpression: "#key = :inputName and #time >= :timestamp",
		    ExpressionAttributeNames:{
		        "#key": "rideName",
		        "#time": "timestamp",
		    },
		    ExpressionAttributeValues: {
		        ":inputName":rideName,
		        ":timestamp":1485817556363
		    }
		};

		docClient.query(params, function(err, data) {
		    if (err) {
		        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
		    } else {
		        console.log("Query succeeded.");
		        data.Items.forEach(function(item) {
		            console.log(item);
		        });
		    }
		});	
	}

	queryWaitingtime('Special Effects Show');