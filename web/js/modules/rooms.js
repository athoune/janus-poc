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
      let that = this;
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
        that.$router.push(`/room/${result.room}`);
        if (this.$store.state.room.id == "") {
          return ab.join({ room: result.room });
        } else {
          return ab.changeroom({ room: result.room });
        }
      }, cause => {
        console.error(cause);
      });
    }
  }
});