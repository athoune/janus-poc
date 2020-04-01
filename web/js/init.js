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
          iceServers: [
            {
              urls: [
                "stun:blog.garambrogne.net"
                /*"stun:stun.l.google.com:19302",
                "stun:stun4.l.google.com:19302",
                "stun:stunserver.org"*/
              ]
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
        },
        onremotestream: stream => {
          // We have a remote stream (working PeerConnection!) to display
          Janus.attachMediaStream(document.getElementById(ab.audio_id), stream);
          console.log("remote stream", stream);
        },
        oncleanup: () => {
          // PeerConnection with the plugin closed, clean the UI
          // The plugin handle is still valid so we can create a new one
        },
        detached: () => {
          // Connection with the plugin closed, get rid of its features
          // The plugin handle is not valid anymore
        },
        ondataopen: data => {
          console.log("Data is open");
        },
        ondata: data => {
          console.log("Data received");
        }
      });
    });
  });
}
