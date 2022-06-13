const {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");

const rtmToken = async (req, res) => {
  const appID = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERT;
  const RtmRole = 1;
  //1 hour
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  if (!req.body) {
    res.status(401).json({
      error: "You are calling a post endpoint, please add body data.",
    });
    return;
  }

  const token = RtmTokenBuilder.buildToken(
    appID,
    appCertificate,
    req.body.account,
    RtmRole,
    privilegeExpiredTs
  );

  res.status(201).json({ token: token });
};

module.exports = {
  rtmToken,
};
