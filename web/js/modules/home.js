Vue.component("home", {
    template: `<div>
    Home
  </div>`,
    watch: {
        $route: "enter"
    },
    methods: {
        enter() {
            if (this.$store.state.room.id != "") {
                this.$store.state.audiobridge.leave({});
            }
            this.$store.state.participants = [];
            this.$store.state.room.name = "";
            this.$store.state.room.id = "";
        }
    },
    created() {
        this.enter();
    }
});