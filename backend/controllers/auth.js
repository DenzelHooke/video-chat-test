const {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");

const rtcToken = async (req, res) => {
  console.log("rtcToken hit");
  console.log(req.body);
  if (!req.body) {
    res.status(401).json({
      error:
        "You are calling a post endpoint, please add a channel name and a publisher status bool.",
    });
    return;
  }
  try {
    const { channel, isPublisher } = req.body;
  
    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERT;
    const channelName = channel;
    //Publisher gives user ability to stream their video and audio whilst sub only allows viewing others.
    const role = isPublisher ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const uid = String(Math.floor(Math.random() * 50000) + 1);
  
    //1 hour
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    //Token expires after 1 hour of being issued to client
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    
    console.log(appID)
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );
    console.log("Token With Integer Number Uid: " + token);
    res.status(200).json({
      token: token,
      uid: uid,
      appID: appID,
    });
  } catch (err) {
    res.status(401).json({err: err, stack: err.stack});
  }
};

const rtmToken = async (req, res) => {
  console.log("rtmToken hit");
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
  rtcToken,
  rtmToken,
};
