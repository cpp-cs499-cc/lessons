Screenshot Service
----------------------
A simple demonstration on how to get website screenshot and save it to S3.

Note: You need to configure your AWS credentials with the S3 Read/Write permission first.

See instructions at https://aws.amazon.com/sdk-for-node-js/

You also need to install the dependencies first, by using

`npm install`

Get Screenshots
---------------
`HTTP GET /screenshot?url=<websiteurl>`

List All the Screenshots
------------------------
`HTTP GET /list`
