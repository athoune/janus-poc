import "/js/modules/janus.js";
import "/js/modules/rooms.js";
import "/js/modules/room.js";
import { audiobridge, AudioBridgeBase } from "/js/init.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    rooms: [],
    participants: [],
    audiobridge: [],
    room: {
      name: "",
      id: ""
    },
  }
});

const Home = {
  template: `<div>
    Home
  </div>`
};

const routes = [
  {
    path: "/room/:id",
    component: Vue.component("room"),
    props: true
  },
  {
    path: "/",
    component: Home
  }
];

const router = new VueRouter({
  routes // short for `routes: routes`
});

const app = new Vue({
  // provide the store using the "store" option.
  // this will inject the store instance to all child components.
  store: store,
  router: router
});

class MyAudioBridge extends AudioBridgeBase {
  constructor(mixer, audio_id) {
    super(mixer, audio_id);
    this.audiobridge.list({}).then(result => {
      console.log("rooms", result);
      store.state.rooms = result.list;
    });
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
            console.log(`Room ${msg.room} with id ${msg.id}`);
            app.$store.state.room.id = msg.id;
            app.$store.state.room.name = msg.room;
            app.$store.state.articipants = msg.participants;
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
          console.log("room changed", msg);
          app.$store.state.room.id = msg.id;
          app.$store.state.room.name = msg.room;
          app.$store.state.articipants = msg.participants;
          break;
        case "destroyed":
          console.log("room destroyed", msg);
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
  MyAudioBridge,
  "janus-roomaudio"
).then(ab => {
  console.log("audiobridge is ready: ", ab);
  store.state.audiobridge = ab.audiobridge;
  app.$mount("#app");
});