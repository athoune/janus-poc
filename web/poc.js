class AudioBridge {
  constructor(pluginHandle) {
    this.handle = pluginHandle;
  }
  create(args) {
    args.request = "create";
    let that = this;
    return new Promise((resolve, reject) => {
      that.handle.send({
        message: args,
        error: reject,
        success: resolve
      });
    });
  }
  changeroom(args) {
    args.request = "changeroom";
    let that = this;
    return new Promise((resolve, reject) => {
      that.handle.send({
        message: args,
        error: reject,
        success: resolve
      });
    });
  }
  join(args) {
    args.request = "join";
    let that = this;
    return new Promise((resolve, reject) => {
      that.handle.send({
        message: args,
        error: reject,
        success: resolve
      });
    });
  }
}

// Prepare a Janus instance
function init(servers) {
  return new Promise((resolve, reject) => {
    // Make sure the browser supports WebRTC
    if (!Janus.isWebrtcSupported()) {
      reject(Error("Webrtc unavailable"));
      return;
    }
    Janus.init({
      debug: false,
      dependencies: Janus.useDefaultDependencies(), // or: Janus.useOldDependencies() to get the behaviour of previous Janus versions
      callback: () => {
        janus = new Janus({
          server: servers,
          success: () => {
            resolve(janus);
          },
          error: reject
        });
      }
    });
  });
}

let mixer = null;
let webrtcUp = false;

function bootstrap(servers, onsuccess, onmessage) {
  init(servers).then(janus => {
    janus.attach({
      plugin: "janus.plugin.audiobridge",
      success: pluginHandle => {
        mixer = pluginHandle;
        let audiobridge = new AudioBridge(pluginHandle);
        onsuccess(audiobridge);
      },
      onmessage: onmessage,
      slowLink: () => {
        console.log("Slow link", arguments);
      },
      error: cause => {
        // Couldn't attach to the plugin
        console.log("error", cause);
      },
      consentDialog: on => {
        console.log("consent", on);
      },
      onlocalstream: stream => {
        // We have a local stream (getUserMedia worked!) to display
        console.log("local stream", stream);
      },
      onremotestream: stream => {
        // We have a remote stream (working PeerConnection!) to display
        Janus.attachMediaStream(document.getElementById("roomaudio"), stream);
        console.log("remote stream", stream);
      },
      oncleanup: () => {
        // PeerConnection with the plugin closed, clean the UI
        // The plugin handle is still valid so we can create a new one
      },
      detached: () => {
        // Connection with the plugin closed, get rid of its features
        // The plugin handle is not valid anymore
      }
    });
  });
}

bootstrap(
  ["ws://localhost:8188/", "http://localhost:8088/janus"],
  audiobridge => {
    audiobridge
      .create({ permanent: false, record: false })
      .then(
        result => {
          console.log(result);
          return audiobridge.join({ room: result.room });
        },
        error => {
          console.log(error);
        }
      )
      .then(result => {
        console.log(result);
      });
  },
  (msg, jsep) => {
    // We got a message/event (msg) from the plugin
    // If jsep is not null, this involves a WebRTC negotiation
    console.log("message", msg);
    let event = msg.audiobridge;
    if (event != undefined && event != null) {
      switch (event) {
        case "joined":
          if (msg.id) {
            console.log(`Room ${msg.room} with id {msg.id}`);
            if (!webrtcUp) {
              webrtcUp = true;
              mixer.createOffer({
                media: {
                  video: false
                },
                success: jsep => {
                  mixer.send({
                    message: {
                      request: "configure",
                      muted: false
                    },
                    jsep: jsep
                  });
                },
                error: error => {
                  console.error(error);
                }
              });
            }
          }
          if (msg.participants !== undefined && msg.participants !== null) {
            for (let participant in msg.participants) {
              console.log(participant);
            }
          }
          break;
        case "roomchanged":
        case "destroyed":
          console.log("room destroyed");
          break;
        case "event":
      }
    }
    if (jsep !== undefined && jsep !== null) {
      console.log(jsep);
      mixer.handleRemoteJsep({ jsep: jsep });
    }
  }
);
