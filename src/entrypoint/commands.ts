import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

const lambdaClient = new LambdaClient({});

export const startEC2 = async (payload) => {
  const functionARN = process.env.START_EC2_INSTANCES_LAMBDA;

  try {
    const command = new InvokeCommand({
      FunctionName: functionARN,
      InvocationType: "Event",
      Payload: JSON.stringify(payload),
    });

    const response = await lambdaClient.send(command);

    return "ｻｰﾊﾞｰｷﾄﾞｳﾁｭｳ...";
  } catch (error) {
    console.log(error);
    return "ﾅﾝｶｵｶｼｲ";
  }
};

export const stopEC2 = async (payload) => {
  const functionARN = process.env.STOP_EC2_INSTANCES_LAMBDA;

  try {
    const command = new InvokeCommand({
      FunctionName: functionARN,
      InvocationType: "Event",
      Payload: JSON.stringify(payload),
    });

    const response = await lambdaClient.send(command);

    return "ｻｰﾊﾞｰﾃｲｼﾁｭｳ...";
  } catch (error) {
    console.log(error);
    return "ﾅﾝｶｵｶｼｲ";
  }
};

export const statusServer = async (payload) => {
  const functionARN = process.env.STATUS_SERVER_INSTANCES_LAMBDA;

  try {
    const command = new InvokeCommand({
      FunctionName: functionARN,
      InvocationType: "Event",
      Payload: JSON.stringify(payload),
    });

    const response = await lambdaClient.send(command);

    return "ｶｸﾆﾝﾁｭｳ...";
  } catch (error) {
    console.log(error);
    return "ﾅﾝｶｵｶｼｲ";
  }
};
