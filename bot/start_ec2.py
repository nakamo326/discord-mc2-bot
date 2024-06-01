import boto3
import os
import json
from urllib import request

region = "ap-northeast-1"
instances = [os.environ["INSTANCE_ID"]]
ec2 = boto3.client("ec2", region_name=region)


def lambda_handler(event, context):
    ec2.start_instances(InstanceIds=instances)

    # ec2が起動後、IPアドレスにアクセスできるようになるまで待つ
    waiter = ec2.get_waiter("instance_running")
    waiter.wait(InstanceIds=instances)

    # IPアドレスを取得
    response = ec2.describe_instances(InstanceIds=instances)
    ip_address = response["Reservations"][0]["Instances"][0]["PublicIpAddress"]

    # IPアドレスをRoute53に登録
    route53 = boto3.client("route53")
    route53.change_resource_record_sets(
        HostedZoneId=os.environ["HOSTED_ZONE_ID"],
        ChangeBatch={
            "Changes": [
                {
                    "Action": "UPSERT",
                    "ResourceRecordSet": {
                        "Name": os.environ["DOMAIN_NAME"],
                        "Type": "A",
                        "TTL": 300,
                        "ResourceRecords": [{"Value": ip_address}],
                    },
                }
            ]
        },
    )

    # discord interactionにレスポンスを返す
    print(event)
    app_id = event["appId"]
    token = event["token"]
    req = request.Request(
        f"https://discord.com/api/v10/webhooks/{app_id}/{token}",
        data=json.dumps({"content": "ｷﾄﾞｳｶﾝﾘｮｳ"}).encode(),
        headers={
            "Content-Type": "application/json",
        },
        method="POST",
    )
    request.urlopen(req)

    return {"statusCode": 200, "body": {"status": "success"}}
