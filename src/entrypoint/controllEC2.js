import { Lambda } from "aws-sdk";

const lambda = new Lambda({ region });

export const startEC2 = async (payload) => {
  const functionARN = process.env.START_EC2_INSTANCES_LAMBDA;
  console.log(functionARN);

  try {
    const params = {
      FunctionName: functionARN,
      InvocationType: "Event",
      Payload: JSON.stringify(payload),
    };

    const response = await lambda.invoke(params).promise();
    return "ｻｰﾊﾞｰｷﾄﾞｳﾁｭｳ...";
  } catch (error) {
    console.log(error);
    return "ﾅﾝｶｵｶｼｲ";
  }
};

export const stopEC2 = async (payload) => {
  const functionARN = process.env.STOP_EC2_INSTANCES_LAMBDA;
  console.log(functionARN);

  try {
    const params = {
      FunctionName: functionARN,
      InvocationType: "Event",
      Payload: JSON.stringify(payload),
    };

    const response = await lambda.invoke(params).promise();

    return "ｻｰﾊﾞｰﾃｲｼﾁｭｳ...";
  } catch (error) {
    console.log(error);
    return "ﾅﾝｶｵｶｼｲ";
  }
};
