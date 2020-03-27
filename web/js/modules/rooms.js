Vue.component('room', {
    props : ["name", "id"],
    template: '<li>{{ name }}</li>',
});

Vue.component('rooms', {
    //props: [room],
    template: `<div>
        <h5>Rooms</h5>
        <ul>
        <room v-for="room in rooms"
            v-bind:key="room.id"
            v-bind:name="room.name"
        ></room>
        </ul>
        </div>`,
    data: () => {
        return {
            rooms: [],
        };
    }
});