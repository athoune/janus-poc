
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
  changeroom(args) { // it returns nothing, watch for roomchanged event
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
}
