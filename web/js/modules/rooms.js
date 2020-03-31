Vue.component("room-item", {
  props: ["name", "id"],
  template: `<li>
    <router-link v-bind:to="'/room/' + id">{{ name }}</router-link>
    </li>`
});

Vue.component("rooms", {
  props: [],
  template: `<aside style="float: left;">
        <h5>Rooms</h5>
        <input type="text" id="room_name" v-model="room_name" placeholder="room name"/>
        <button v-on:click="newRoom(room_name)">New room</button>
        <ul>
        <room-item v-for="room in $store.state.rooms"
            v-bind:id="room.room"
            v-bind:key="room.room"
            v-bind:name="room.description"
        ></room-item>
        </ul>
        </aside>`,
  data: () => {
    return {
      room_name: ""
    };
  },
  methods: {
    newRoom: function(name, event) {
      let ab = this.$store.state.audiobridge;
      ab.create({
        permanent: false,
        record: false,
        description: name
      }).then(result => {
        console.dir(result);
        this.$store.state.rooms.push({
          room: result.room,
          description: name
        });
        console.log("room created", result);
        return ab.join({ room: result.room });
      });
    }
  }
});

Vue.component("room", {
  props: ["id"],
  template: `
    <div>
        <h4>Room {{ name }}</h4>
        {{ id }}
    </div>
    `,
  computed: {
    name() {
      return this.$store.state.room.name;
    }
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchData",
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
