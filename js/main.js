//! Don't touch
let _appID;
let _token;
let _uid;

var channelName = "agora-test-channel";

// video profile settings
var cameraVideoProfile = "1080p_5"; // 640 × 480 @ 30fps  & 750kbs
var screenVideoProfile = "480p_2"; // 640 × 480 @ 30fps

const client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
console.log(client);
let screenClient;
// let uid = String(Math.floor(Math.random() * 50000) + 1);

const remoteStreams = {};
const localStreams = {
  camera: {
    id: "",
    stream: {},
  },
  screen: {
    id: "",
    stream: {},
  },
};

let mainStreamID; // reference to main stream
let screenShareActive; // flag for screen share

client.on("stream-published", (e) => {
  console.log("stream published");
});

client.on("stream-added", (e) => {
  const stream = e.stream;
  const streamID = stream.getId();
  console.log("new stream added " + streamID);
  //Check if stream is local

  if (streamID != localStreams.camera.id) {
    console.log("sub to remote stream: " + streamID);
    stream.setVideoProfile(cameraVideoProfile);
    client.subscribe(stream, (err) => {
      console.log("[ERROR] : subscrive to stream failed", err);
    });
  }
});

client.on("stream-subscribed", (e) => {
  const remoteStream = e.stream;
  const remoteID = remoteStream.getId();
  remoteStreams[remoteID] = remoteStream;
  console.log("Subscribed to remote stream successfully: " + remoteID);
  mainStreamID = remoteID;
  addStream(remoteStream);
});

const addStream = (remoteStream) => {
  const number = String(Math.floor(Math.random() * 10000) + 1);
  const peerStreams = document.querySelector("#videos");
  const new_video = document.createElement("div");
  new_video.classList.add("video-player");
  new_video.id = `video-${number}`;
  console.log(new_video);
  peerStreams.appendChild(new_video);
  remoteStream.play(`video-${number}`);
};

const joinChannel = async (token, uid) => {
  client.join(
    token,
    channelName,
    uid,
    (uid) => {
      console.log(`User ${uid} joined channel successfully;`);
      createCameraStream(uid);
      localStreams.camera.id = uid;
    },
    (err) => {
      console.log("[ERROR] : join channel failed", err);
    }
  );
};

const createCameraStream = (uid) => {
  const localStream = AgoraRTC.createStream({
    streamID: uid,
    audio: false,
    video: true,
    screen: false,
  });
  localStream.setVideoProfile(cameraVideoProfile);
  localStream.init(
    () => {
      console.log("getUserMedia successful!");
      localStream.play("user-1"); //Play stream within the user-1 div element
      client.publish(localStream, (err) => {
        console.log(`[ERROR] : Publishing stream failed`, err);
        localStreams.camera.stream = localStream; // Keep track of localStream for later
      });
    },
    (err) => console.log(`Error with get media`)
  );
};

const init = async () => {
  //Get token and appID
  const res = await axios.post("http://localhost:8080/auth/rtctoken/", {
    channel: channelName,
    isPublisher: false,
  });
  _token = res.data.token;
  _uid = res.data.uid;
  _appID = res.data.appID;

  //Init client
  client.init(
    _appID,
    () => {
      // document.getElementById("user-1").srcObject = localStreams.camera.stream;
      console.log("Agora client init'd");
      joinChannel(_token, _uid);
    },
    (err) => {
      console.log("[ERROR]: AgoraRTC client init failed", err);
    }
  );
};

init();
