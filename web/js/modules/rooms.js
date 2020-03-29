Vue.component('room-item', {
    props : ["name", "id"],
    template: `<li>
    <router-link v-bind:to="'/route' + id">{{ name }}</router-link>
    </li>`,
});

Vue.component('rooms', {
    //props: [room],
    template: `<div>
        <h5>Rooms</h5>
        <input type="text" id="room_name"/>
<button id="room_new">New room</button>
        <ul>
        <room-item v-for="room in $root.$data.rooms"
            v-bind:key="room.room"
            v-bind:name="room.description"
        ></room-item>
        </ul>
        </div>`,
    data: () => {
        return {
            rooms: [],
        };
    }
});

Vue.component('room', {
    template: `
    <div>
        <h4>{{ name }}</h4>
        {{ $route.params.id }}
    </div>
    `,
    props: ['name'],
});