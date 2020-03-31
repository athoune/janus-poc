Vue.component("room", {
  props: ["id"],
  template: `
    <div>
        <h4>Room {{ name }}</h4>
        {{ id }}
        <ul id="participants">
            <participant v-for="participant in participants"
            v-bind:name="participant.display"
            v-bind:key="participant.id"
            v-bind:id="participant.id"
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
      console.log(this.$store.state.room.id);
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
    }
  }
});

Vue.component("participant", {
  props: ["id", "name"],
  template: `<li>{{ name }}#{{ id }}</li>`
});
