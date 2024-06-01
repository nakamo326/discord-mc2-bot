const {
  InteractionType,
  InteractionResponseType,
  verifyKey,
} = require("discord-interactions");
const { Lambda } = require("aws-sdk");

const verifyRequest = (event) => {
  const { headers, body } = event;
  const signature = headers["x-signature-ed25519"];
  const timestamp = headers["x-signature-timestamp"];
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!body || !signature || !timestamp || !publicKey) {
    return false;
  }
  return verifyKey(body, signature, timestamp, publicKey);
};

const region = "ap-northeast-1";
const lambda = new Lambda({ region });

const startEC2 = async (payload) => {
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

const stopEC2 = async (payload) => {
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

const handleInteraction = async (interaction) => {
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const { data } = interaction;
    let resContent;

    // メッセージ更新用にtokenを渡す
    const payload = {
      token: interaction.token,
      appId: interaction.application_id,
    };

    switch (data.options[0].value) {
      case "start":
        resContent = await startEC2(payload);
        break;
      case "stop":
        resContent = await stopEC2(payload);
        break;
      case "test":
        resContent = "ﾎﾟﾝ";
        break;
      default:
        resContent = "ｺﾏﾝﾄﾞﾜｶﾝﾅｲ";
    }

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: resContent,
      },
    };
  }
};

exports.handler = async (event) => {
  if (!verifyRequest(event)) {
    console.log("invalid request");
    return {
      statusCode: 401,
    };
  }
  console.log("verified");

  const { body } = event;
  const interaction = JSON.parse(body);

  // pingの場合はpongを返す、URL登録用
  if (interaction.type === InteractionType.PING) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: InteractionResponseType.PONG,
      }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(await handleInteraction(interaction)),
  };
};
