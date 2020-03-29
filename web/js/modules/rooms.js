Vue.component('room', {
    props : ["name", "id"],
    template: `<li>
    <router-link v-bind:to="'/route' + id">{{ name }}</router-link>
    </li>`,
});

Vue.component('rooms', {
    //props: [room],
    template: `<div>
        <h5>Rooms</h5>
        <ul>
        <room v-for="room in $root.$data.rooms"
            v-bind:key="room.room"
            v-bind:name="room.description"
        ></room>
        </ul>
        </div>`,
    data: () => {
        return {
            rooms: [],
        };
    }
});