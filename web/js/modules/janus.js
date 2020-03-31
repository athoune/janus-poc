

Vue.component("janus", {
  template: `<div>
  <h1><router-link v-bind:to="'/'">Janus rulez</router-link></h1>
  <audio id="janus-roomaudio" autoplay />
  <slot></slot>
    </div>`,
  data: () => {
      return {
          janus: null,
          rooms: [],
      };
  }
});