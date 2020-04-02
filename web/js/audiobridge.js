export class AudioBridge {
  constructor(pluginHandle) {
    this.handle = pluginHandle;
  }
  create(args) {
    args.request = "create";
    let that = this;
    return new Promise((resolve, reject) => {
      that.handle.send({
        message: args,
        error: reject,
        success: resolve
      });
    });
  }
  changeroom(args) {
    // it returns nothing, watch for roomchanged event
    args.request = "changeroom";
    let that = this;
    return new Promise((resolve, reject) => {
      that.handle.send({
        message: args,
        error: reject,
        success: resolve
      });
    });
  }
  join(args) {
    args.request = "join";
    args.display = window.navigator.userAgent
      .split(" ")
      .pop()
      .split("/")[0];
    let that = this;
    return new Promise((resolve, reject) => {
      that.handle.send({
        message: args,
        error: reject,
        success: resolve
      });
    });
  }
  list(args) {
    args.request = "list";
    let that = this;
    return new Promise((resolve, reject) => {
      that.handle.send({
        message: args,
        error: reject,
        success: resolve
      });
    });
  }
  exists(args) {
    args.request = "exists";
    let that = this;
    return new Promise((resolve, reject) => {
      that.handle.send({
        message: args,
        error: reject,
        success: resolve
      });
    });
  }
  leave(args) {
    args.request = "leave";
    let that = this;
    return new Promise((resolve, reject) => {
      that.handle.send({
        message: args,
        error: reject,
        success: resolve
      });
    });
  }
  configure(args, jsep) {
    args.request = "configure";
    let that = this;
    return new Promise((resolve, reject) => {
      const msg = {
        message: args,
        error: reject,
        success: resolve
      };
      if (jsep != undefined) {
        msg.jsep = jsep;
      }
      that.handle.send(msg);
    });
  }
}
