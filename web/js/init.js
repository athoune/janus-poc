
// Prepare a Janus instance
export function newJanus(servers) {
  return new Promise((resolve, reject) => {
    // Make sure the browser supports WebRTC
    if (!Janus.isWebrtcSupported()) {
      reject(Error("Webrtc unavailable"));
      return;
    }
    Janus.init({
      debug: false,
      dependencies: Janus.useDefaultDependencies(), // or: Janus.useOldDependencies() to get the behaviour of previous Janus versions
      callback: () => {
        let janus = new Janus({
          server: servers,
          success: () => {
            resolve(janus);
          },
          error: reject
        });
      }
    });
  });
}