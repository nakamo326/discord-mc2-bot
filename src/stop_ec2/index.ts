import { EC2Client, DescribeInstancesCommand, StopInstancesCommand } from "@aws-sdk/client-ec2";
import { Route53Client, ChangeResourceRecordSetsCommand } from "@aws-sdk/client-route-53";

const instanceId = process.env.EC2_INSTANCE_ID;
const hostedZoneId = process.env.HOSTED_ZONE_ID;
const domainName = process.env.DOMAIN_NAME;

const ec2Client = new EC2Client({});
const route53Client = new Route53Client({});

exports.handler = async (event) => {
  if (!instanceId || !hostedZoneId || !domainName) {
    return { statusCode: 500, body: { status: "error" } };
  }

  try {
    // get the public IP of the instance
    const describeCommand = new DescribeInstancesCommand({
      InstanceIds: [instanceId],
    });
    const { Reservations } = await ec2Client.send(describeCommand);
    if (!Reservations || !Reservations[0].Instances || !Reservations[0].Instances[0]) {
      return { statusCode: 500, body: { status: "error" } };
    }
    const PublicIpAddress = Reservations[0].Instances[0].PublicIpAddress;

    // delete A record from Route 53
    const changeCommand = new ChangeResourceRecordSetsCommand({
      HostedZoneId: hostedZoneId,
      ChangeBatch: {
        Changes: [
          {
            Action: "DELETE",
            ResourceRecordSet: {
              Name: domainName,
              Type: "A",
              TTL: 300,
              ResourceRecords: [{ Value: PublicIpAddress }],
            },
          },
        ],
      },
    });
    await route53Client.send(changeCommand);

    // stop the instance
    const stopCommand = new StopInstancesCommand({
      InstanceIds: [instanceId],
    });
    await ec2Client.send(stopCommand);

    // send following response to Discord
    if (event.appId && event.token) {
      const appId = event.appId;
      const token = event.token;
      await fetch(`https://discord.com/api/v9/webhooks/${appId}/${token}/messages/@original`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: "ﾃｲｼｶﾝﾘｮｳ" }),
      });
    }

    return { statusCode: 200, body: { status: "success" } };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: { status: "error" } };
  }
};
