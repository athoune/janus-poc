let mixer = null;
let webrtcUp = false;
let janus = null;

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

function init() {
  return new Promise((resolve, reject) => {
    Janus.init({
      debug: true,
      dependencies: Janus.useDefaultDependencies(), // or: Janus.useOldDependencies() to get the behaviour of previous Janus versions
      callback: resolve,
    });
  });
}

init().then(() => {
  // Make sure the browser supports WebRTC
  if (!Janus.isWebrtcSupported()) {
    console.log("oups");
    return;
  }
  janus = new Janus({
    server: ["ws://localhost:8188/", "http://localhost:8088/janus"],
    success: () => {
      console.log("session id", janus.getSessionId());
      janus.attach({
        plugin: "janus.plugin.audiobridge",
        success: pluginHandle => {
          // Plugin attached! 'pluginHandle' is our handle
          mixer = pluginHandle;
          console.log("Plugin attached", mixer.getPlugin(), mixer.getId());
          console.dir("mixer", mixer);
          let audiobridge = new AudioBridge(pluginHandle);
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
        onmessage: (msg, jsep) => {
          Janus.debug(" ::: Got a message :::");
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
                if (
                  msg.participants !== undefined &&
                  msg.participants !== null
                ) {
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
    },
    error: function(cause) {
      console.error(cause);
      // Error, can't go on...
    },
    destroyed: function() {
      // I should get rid of this
    }
  });
});
