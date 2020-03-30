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
        <room-item v-for="room in $root.$data.rooms"
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
      let ab = this.$root.$data.audiobridge;
      ab.create({
        permanent: false,
        record: false,
        description: name
      }).then(result => {
        console.dir(result);
        this.$root.$data.rooms.push({
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
        <h4>Room {{ $root.$data.room.name }}</h4>
        {{ id }}
    </div>
    `,
  data: () => {
    return {
      name: ""
    };
  },
  mounted: function() {
    let ab = this.$root.$data.audiobridge;
    const id = parseInt(this.id, 10);
    if (isNaN(id)) {
        console.error("This id is not a number : ", this.id);
        return;
    }
    console.log("joining ", id);
    ab.join({ room: id }).then(
      result => {
      },
      error => {
        console.log(error);
      }
    );
  }
});
