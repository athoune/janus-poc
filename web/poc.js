Janus.init({
  debug: true,
  dependencies: Janus.useDefaultDependencies(), // or: Janus.useOldDependencies() to get the behaviour of previous Janus versions
  callback: function() {
    console.log("Janus cb");
  }
});

var janus = new Janus({
  server: ["ws://localhost:8188/", "http://localhost:8088/janus"],
  success: function() {
    // Done! attach to plugin XYZ
    console.log("Janus is ready");
  },
  error: function(cause) {
      console.error(cause);
    // Error, can't go on...
  },
  destroyed: function() {
    // I should get rid of this
  }
});
