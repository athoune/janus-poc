import { AudioBridge } from "/js/audiobridge.js";

// Prepare a Janus instance
export function newJanus(servers) {
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
        let janus = new Janus({
          server: servers,
          iceServers: [ // https://developer.mozilla.org/en-US/docs/Web/API/RTCIceServer
            {
              urls: "turn:xp.garambrogne.net",
              username: "bob",
              credential: "sponge"
            }
          ],
          success: () => {
            resolve(janus);
          },
          error: reject
        });
      }
    });
  });
}

export class AudioBridgeBase {
  constructor(mixer, audio_id) {
    this.mixer = mixer;
    this.audio_id = audio_id;
    this.audiobridge = new AudioBridge(mixer);
    this.webrtcUp = false;
  }
  onmessage(msg, jesp) {
    console.log(msg, jesp);
  }
}

export function audiobridge(servers, bridge, audio_id) {
  let ab = null;

  return new Promise((resolve, reject) => {
    newJanus(servers).then(janus => {
      janus.attach({
        plugin: "janus.plugin.audiobridge",
        success: pluginHandle => {
          Janus.listDevices(
            devices => {
              console.log("device", devices);
            },
            { video: false, audio: true }
          );
          ab = new bridge(pluginHandle, audio_id);
          resolve(ab);
        },
        onmessage: (msg, jsep) => {
          ab.onmessage(msg, jsep);
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
        onlocalstream: stream => {
          // We have a local stream (getUserMedia worked!) to display
          console.log("local stream", stream);
          stream.onaddtrack = function(track) {
            console.log("local track added", track, this);
          };
        },
        onremotestream: stream => {
          // We have a remote stream (working PeerConnection!) to display
          console.log(
            "remote stream",
            document.getElementById(ab.audio_id),
            stream
          );
          Janus.attachMediaStream(document.getElementById(ab.audio_id), stream);
          stream.onaddtrack = function(track) {
            console.log("remote track added", track, this);
          };
          stream.onactive = function() {
            console.log("remote track active", this);
          };
        },
        oncleanup: () => {
          // PeerConnection with the plugin closed, clean the UI
          // The plugin handle is still valid so we can create a new one
          console.log("cleanup");
        },
        detached: () => {
          // Connection with the plugin closed, get rid of its features
          // The plugin handle is not valid anymore
          console.log("detached");
        },
        ondataopen: data => {
          console.log("Data is open", data);
        },
        ondata: data => {
          console.log("Data received", data);
        },
        webrtcState: on => {
          console.log("webrtc state ", on);
        }
      });
    });
  });
}
