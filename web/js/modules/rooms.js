export function showroom(msg) {
    console.log("rooms: ", msg);
}

Vue.component('room', {
    template: '<li></li>',
});

Vue.component('rooms', {
    //props: [room],
    template: '<ul></ul>',
});