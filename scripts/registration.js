// import fetch from "node-fetch";

const appID = process.env.APP_ID;
const guildID = process.env.GUILD_ID;
const apiEndpoint = `https://discord.com/api/v8/applications/${appID}/guilds/${guildID}/commands`;
const botToken = process.env.BOT_TOKEN;

const commandData = {
  name: "mc",
  description: "start/stop minecraft server.",
  options: [
    {
      name: "action",
      description: "start/stop or test",
      type: 3,
      required: true,
      choices: [
        {
          name: "start",
          value: "start",
        },
        {
          name: "stop",
          value: "stop",
        },
        {
          name: "status",
          value: "status",
        },
        {
          name: "test",
          value: "test",
        },
      ],
    },
  ],
};

async function main() {
  const response = await fetch(apiEndpoint, {
    method: "post",
    body: JSON.stringify(commandData),
    headers: {
      Authorization: `Bot ${botToken}`,
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();

  console.log(json);
}
main();
