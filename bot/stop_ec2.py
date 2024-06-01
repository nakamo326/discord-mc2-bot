import boto3
import os
import json
from urllib import request

region = "ap-northeast-1"
instances = [os.environ["INSTANCE_ID"]]
ec2 = boto3.client("ec2", region_name=region)


def lambda_handler(event, context):
    # IPアドレスを取得、Route53からレコードを削除
    response = ec2.describe_instances(InstanceIds=instances)
    ip_address = response["Reservations"][0]["Instances"][0]["PublicIpAddress"]
    route53 = boto3.client("route53")
    route53.change_resource_record_sets(
        HostedZoneId=os.environ["HOSTED_ZONE_ID"],
        ChangeBatch={
            "Changes": [
                {
                    "Action": "DELETE",
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

    # EC2を停止
    ec2.stop_instances(InstanceIds=instances)

    # discord interactionにレスポンスを返す
    app_id = event["appId"]
    token = event["token"]
    req = request.Request(
        f"https://discord.com/api/v10/webhooks/{app_id}/{token}",
        data=json.dumps({"content": "ﾃｲｼｶﾝﾘｮｳ"}).encode(),
        headers={"Content-Type": "application/json", "User-Agent": ""},
        method="POST",
    )
    request.urlopen(req)

    return {"statusCode": 200, "body": {"status": "success"}}
