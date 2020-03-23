let mixer = null;
let webrtcUp = false;

Janus.init({
  debug: "all",
  dependencies: Janus.useDefaultDependencies(), // or: Janus.useOldDependencies() to get the behaviour of previous Janus versions
  callback: () => {
    // Make sure the browser supports WebRTC
    if (!Janus.isWebrtcSupported()) {
      console.log("oups");
      return;
    }
    let janus = new Janus({
      server: [
        //"ws://localhost:8188/",
        "http://localhost:8088/janus"],
      success: () => {
        console.log("session id", janus.getSessionId());
        janus.attach({
          plugin: "janus.plugin.audiobridge",
          success: pluginHandle => {
            // Plugin attached! 'pluginHandle' is our handle
            mixer = pluginHandle;
            console.log("Plugin attached", mixer.getPlugin(), mixer.getId());
            mixer.send({
              message: {
                request: "create",
                permanent: false,
                record: false
              }
            });
          },
          slowLink: () => {
            console.log(arguments);
          },
          error: cause => {
            // Couldn't attach to the plugin
            console.error(cause);
          },
          consentDialog: on => {
            console.log("consent", on);
          },
          onmessage: (msg, jsep) => {
            // We got a message/event (msg) from the plugin
            // If jsep is not null, this involves a WebRTC negotiation
            console.dir(msg);
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
          },
          onremotestream: stream => {
            // We have a remote stream (working PeerConnection!) to display
            Janus.attachMediaStream(
              document.getElementById("roomaudio"),
              stream
            );
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
  }
});
