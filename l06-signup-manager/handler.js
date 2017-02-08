var AWS = require('aws-sdk');

AWS.config.update({
  region: "us-west-2"
});

'use strict';

module.exports.signup = (event, context, callback) => {
  sendSignupMessage(event.pathParameters.name, event.pathParameters.group, callback);  
};

module.exports.getnext = (event, context, callback) => {
  getNextAppointment(callback);  
};


var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
var ses = new AWS.SES({apiVersion: '2010-12-01'});

function sendSignupMessage(name, group, callback) {

  var appointment = {
    'name' : name,
    'group' : group,
    'timestatmp' : Date.now()
  };

  var params = {     
    MessageGroupId: group,
    MessageBody: JSON.stringify(appointment),
    QueueUrl: "https://sqs.us-west-2.amazonaws.com/561892231356/signup.fifo"
  };

  sqs.sendMessage(params, function(err, data) {
    if (err) {
      console.log("Error", err);
      const responseErr = {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
        },
        body: JSON.stringify({
          message: 'Failed to put the message in the queue!'
        }),
      };
      callback(null, responseErr);
    } else {
      console.log("Success", data.MessageId);
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
        },
        body: JSON.stringify({
          message: 'OK!'
        }),
      };
      callback(null, response);      
    }
  });
}

function getNextAppointment(callback) {
  var params = {
   AttributeNames: [
      "SentTimestamp"
   ],
   MaxNumberOfMessages: 1,
   MessageAttributeNames: [
      "All"
   ],
   QueueUrl: "https://sqs.us-west-2.amazonaws.com/561892231356/signup.fifo"   
  };

  sqs.receiveMessage(params, function(err, data) {
    if (err) {
      console.log("Receive Error", err);
      const responseErr = {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
        },
        body: JSON.stringify({
          message: "Failed to get the message from the queue"
        }),
      };
      callback(null, responseErr);
    } else {
      console.log("Received message", data);      
      var deleteParams = {
        QueueUrl: "https://sqs.us-west-2.amazonaws.com/561892231356/signup.fifo",
        ReceiptHandle: data.Messages[0].ReceiptHandle
      };
      sqs.deleteMessage(deleteParams, function(err, data) {
        if (err) {
          console.log("Delete Error", err);
        } else {
          console.log("Message Deleted", data);
        }
      });

      sendEmail();
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
        },
        body: data.Messages[0].Body
      };
      callback(null, response);
    }
  });
}

function sendEmail() {
  // load AWS SES
  
  // send to list
  var to = ['yusun@cpp.edu']

  // this must relate to a verified SES account
  var from = 'yu.sun.cs@gmail.com'

  var params = {
  Destination: { /* required */    
    ToAddresses: to
  },
  Message: { /* required */
    Body: { /* required */
      Html: {
        Data: 'Serving You Now' /* required */
      },
      Text: {
        Data: 'Serving You Now'
      }
    },
    Subject: { /* required */
      Data: 'Your Turn'
    }
  },
  Source: from
};

  // this sends the email
  // @todo - add HTML version
  ses.sendEmail( params, function(err, data) {
        if(err) throw err
            console.log('Email sent:');
        console.log(data);
     });
}
