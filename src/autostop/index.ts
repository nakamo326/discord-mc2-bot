import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const lambdaClient = new LambdaClient({});

const statusServerfunctionARN = process.env.STATUS_SERVER_INSTANCES_LAMBDA;
const stopEC2functionARN = process.env.STOP_EC2_INSTANCES_LAMBDA;

// check if the server is running, and online player is 0, then stop the server
exports.handler = async (event) => {
  try {
    const command = new InvokeCommand({
      FunctionName: statusServerfunctionARN,
      InvocationType: "RequestResponse",
    });

    const response = await lambdaClient.send(command);

    const payload = JSON.parse(response.Payload?.transformToString() ?? "{}");
    const serverStatus = payload.body.status;

    if (serverStatus.online && serverStatus.online === true && serverStatus.onlinePlayerNum === 0) {
      const stopCommand = new InvokeCommand({
        FunctionName: stopEC2functionARN,
        InvocationType: "Event",
      });

      await lambdaClient.send(stopCommand);
    }

    return {
      statusCode: 200,
      body: {
        status: "success",
      },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: {
        status: "error",
      },
    };
  }
};
