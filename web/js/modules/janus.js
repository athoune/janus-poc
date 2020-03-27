

Vue.component("janus", {
  template: `<div>
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