Vue.component("room", {
  props: ["id"],
  template: `
    <div>
        <button v-on:click="mute">{{ muted }}</button>
        <h4>Room {{ name }}</h4>
        {{ id }}
        <ul id="participants">
            <participant v-for="participant in participants"
            v-bind:name="participant.display"
            v-bind:key="participant.id"
            v-bind:id="participant.id"
            v-bind:muted="participant.muted"
            ></participant>
        </ul>
    </div>
    `,
  computed: {
    name() {
      return this.$store.state.room.name;
    },
    participants() {
      return this.$store.state.participants;
    },
    muted() {
        return this.$store.state.muted ? "unmute": "mute";
    }
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchData"
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      let ab = this.$store.state.audiobridge;
      const id = parseInt(this.id, 10);
      if (isNaN(id)) {
        console.error("This id is not a number : ", this.id);
        this.$router.push("/");
        return;
      }
      let r;
      if (this.$store.state.room.id == "") {
        r = ab.join({ room: id });
      } else {
        r = ab.changeroom({ room: id });
      }
      console.log("joining room ", id);
      r.then(
        result => {},
        error => {
          console.log(error);
        }
      );
    },
    mute() {
        let that = this;
      this.$store.state.audiobridge
        .configure({
          muted: ! this.$store.state.muted
        })
        .then(
          response => {
            console.log(response);
            that.$store.state.muted = ! that.$store.state.muted;
          },
          error => {
            console.error(error);
          }
        );
    }
  }
});

Vue.component("participant", {
  props: ["id", "name", "muted"],
  template: `<li>{{ name }}#{{ id }} {{ mic }}</li>`,
  computed: {
      mic() {
        return this.muted ? "🔇" : "🔈";
      }
  }
});
