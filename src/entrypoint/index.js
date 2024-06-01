import { InteractionType, InteractionResponseType } from "discord-interactions";
import { startEC2, stopEC2 } from "./controllEC2.js";
import { verifyRequest } from "./verifyRequest.js";

const handleInteraction = async (interaction) => {
  if (interaction.type === InteractionType.PING) {
    return {
      type: InteractionResponseType.PONG,
    };
  }
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

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(await handleInteraction(interaction)),
  };
};
