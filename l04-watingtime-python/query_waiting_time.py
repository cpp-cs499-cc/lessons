from boto3.dynamodb.conditions import Key, Attr
import boto3

client = boto3.resource('dynamodb', region_name='us-west-1')
table = client.Table('waitingtime')

response = table.query(
    KeyConditionExpression=Key('name').eq('Transformers')
)

print response
for item in response['Items']:
    print item['timestamp'], item['waiting']

