const domainName = process.env.DOMAIN_NAME;

const getOnlinePlayerNum = async (host: string) => {
  const res = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(host)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { players } = await res.json();
  console.log(players.online);
  return players.online;
};

exports.handler = async (event) => {
  if (!domainName) {
    return { statusCode: 500, body: { status: "error" } };
  }

  const host = domainName;
  const onlinePlayerNum = await getOnlinePlayerNum(host);

  if (event.appId && event.token) {
    // send following response to Discord
    const appId = event.appId;
    const token = event.token;
    await fetch(`https://discord.com/api/v9/webhooks/${appId}/${token}/messages/@original`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: `ﾌﾟﾚｲﾁｭｳ: ${onlinePlayerNum}` }),
    });
  }

  return { statusCode: 200, body: { onlinePlayerNum } };
};
