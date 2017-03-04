from bs4 import BeautifulSoup
import urllib
import boto3
import time

client = boto3.resource('dynamodb', region_name='us-west-1')
table = client.Table('waitingtime')

print table.creation_date_time

r = urllib.urlopen('http://m.universalstudioshollywood.com/waittimes/?type=all&site=USH').read()
soup = BeautifulSoup(r, 'html.parser')

timeRows = soup.select('.timeRow')
for row in timeRows:
    title = row.select('.timeTitle')
    timetag = row.select('.timeTime')

    if (len(title) > 0 and len(timetag) > 0):
        titlestr = title[0].string.strip()
        timestr = timetag[0].string.strip()
        print titlestr, timestr
        # save to dynamo
        response = table.put_item(
            Item = {
                'name': titlestr,
                'timestamp': int(time.time()),
                'waiting': timestr
            }
        )


