import { InteractionType, InteractionResponseType } from "discord-interactions";
import { verifyRequest } from "./verifyRequest.js";
import { isCommand, commandMap } from "./definitions.js";

const handleInteraction = async (interaction) => {
  const interactionType = interaction.type;
  const command = interaction.data.options[0].value;

  // メッセージ更新用にtokenを渡す
  const payload = {
    token: interaction.token,
    appId: interaction.application_id,
  };

  if (interactionType === InteractionType.PING) {
    return {
      type: InteractionResponseType.PONG,
    };
  }
  if (interactionType === InteractionType.APPLICATION_COMMAND) {
    const resContent = isCommand(command) ? commandMap[command](payload) : "ｺﾏﾝﾄﾞﾜｶﾝﾅｲ";

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

  const response = await handleInteraction(interaction);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  };
};
