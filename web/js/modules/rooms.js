Vue.component("room-item", {
  props: ["name", "id"],
  template: `<li>
    <router-link v-bind:to="'/route/' + id">{{ name }}</router-link>
    </li>`
});

Vue.component("rooms", {
  props: [],
  template: `<div>
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
        </div>`,
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
  template: `
    <div>
        <h4>Room {{ name }}</h4>
        {{ $route.params.id }}
    </div>
    `,
  data: () => {
      return {
          name: '',
      }
  },
  mounted: function() {
      this.data.name = $route.params.id;
    let ab = this.$root.$data.audiobridge;
    ab.create({ permanent: false, record: false })
      .then(
        result => {
          console.log(result);
          let l = document.location;
          l.hash = `#${result.room}`;
          window.history.pushState({}, "room", l);
          return that.audiobridge.join({ room: result.room });
        },
        error => {
          console.log(error);
        }
      )
      .then(result => {
        console.log(result);
      });
  }
});
