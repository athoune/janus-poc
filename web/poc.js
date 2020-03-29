import '/js/modules/janus.js';
import '/js/modules/rooms.js';
import { audiobridge, AudioBridgeBase } from '/js/init.js';

let data = {
  rooms: Array,
};

let app = new Vue({
  el: '#app',
  data: data,
});

class MyAudioBridge extends AudioBridgeBase {
  constructor(mixer, audio_id) {
    super(mixer, audio_id);
    let r = document.getElementById("rooms");
    let room = window.location.hash;
    let l = document.location;
    let that = this;
    document.getElementById("room_new").onclick = () => {
      that.audiobridge
        .create({
          permanent: false,
          record: false,
          description: document.getElementById("room_name").value
        })
        .then(result => {
          console.log("room created", result);
          let li = document.createElement("li");
          li.appendChild(
            document.createTextNode(document.getElementById("room_name").value)
          );
          r.appendChild(li);
          document.getElementById("room_name").value = "";
          l.hash = `#${result.room}`;
          window.history.pushState({}, "room", l);
          return audiobridge.join({ room: result.room });
        });
    };
    this.audiobridge.list({}).then(result => {
      console.log("rooms", result);
      data.rooms = result.list;
    });
    if (room != "") {
      room = Number(room.substring(1));
      if (isNaN(room)) {
        // Room is invalid, lets reset it
        room = "";
        l.hash = "";
        window.history.pushState({}, "rooms", l);
      }
    }
    console.log("Hash room", room);
    if (room == "") {
      audiobridge
        .create({ permanent: false, record: false })
        .then(
          result => {
            console.log(result);
            let l = document.location;
            l.hash = `#${result.room}`;
            window.history.pushState({}, "room", l);
            return audiobridge.join({ room: result.room });
          },
          error => {
            console.log(error);
          }
        )
        .then(result => {
          console.log(result);
        });
    } else {
      this.audiobridge.join({ room: room });
    }
  }
  onmessage(msg, jsep) {
    // We got a message/event (msg) from the plugin
    // If jsep is not null, this involves a WebRTC negotiation
    console.log("message", msg);
    let event = msg.audiobridge;
    let that = this;
    if (event != undefined && event != null) {
      switch (event) {
        case "joined":
          if (msg.id) {
            console.log(`Room ${msg.room} with id {msg.id}`);
            if (!this.webrtcUp) {
              this.webrtcUp = true;
              this.mixer.createOffer({
                media: {
                  audio: true,
                  video: false,
                  data: true
                },
                success: jsep => {
                  that.mixer.send({
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
      this.mixer.handleRemoteJsep({ jsep: jsep });
    }
  }
}

audiobridge(
  [
    `${window.location.protocol === "http:" ? "ws" : "wss"}://${
      window.location.hostname
    }/`,
    `${window.location.protocol === "http:" ? "http" : "https"}://${
      window.location.hostname
    }/janus`
  ],
  MyAudioBridge, 'janus-roomaudio').then(ab => {
  console.log("audiobridge is ready: ", ab);
});
