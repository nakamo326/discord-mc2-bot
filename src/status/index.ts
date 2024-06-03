const domainName = process.env.DOMAIN_NAME;

const getServerStatus = async (host: string) => {
  const res = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(host)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  console.log("data:", data);
  if (!data) {
    return { online: false, onlinePlayerNum: 0 };
  }
  const { online, players } = data;
  if (!online) {
    return { online: false, onlinePlayerNum: 0 };
  }
  return { online, onlinePlayerNum: players.online };
};

exports.handler = async (event) => {
  if (!domainName) {
    return { statusCode: 500, body: { status: "error" } };
  }

  const host = domainName;
  const status = await getServerStatus(host);
  console.log(status);

  if (event.appId && event.token) {
    // send following response to Discord
    const appId = event.appId;
    const token = event.token;
    await fetch(`https://discord.com/api/v9/webhooks/${appId}/${token}/messages/@original`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: `ﾌﾟﾚｲﾁｭｳ: ${status.onlinePlayerNum}` }),
    });
  }

  return { statusCode: 200, body: { status } };
};
