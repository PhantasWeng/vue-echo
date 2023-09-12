import LaravelEcho from 'laravel-echo';

function getChannel(channels, channelName) {
  const target = Object.keys(channels).find(channel => channels[channel].name.replace('private-', '') === channelName);

  if (!target && this.options.debug) {
    throw new Error(`[Echo] Channel name not exist: ${channelName}`);
  }

  return channels[target];
}

const hooks = [];
function addHookFunction(func) {
  hooks.push(func);
}
function onChange(...params) {
  hooks.forEach(func => func(...params));
}
function join(channelName, options) {
  const {
    isPrivate
  } = options;
  if (this.options.debug) console.debug('[Echo] joinChannel -', isPrivate ? 'private-' + channelName : channelName);
  isPrivate ? this.private(channelName) : this.channel(channelName);
  onChange();
}
function leave(channelName) {
  const targetChannel = getChannel.bind(this)(this.connector.channels, channelName);
  if (this.options.debug) console.debug('[Echo] leaveChannel -', targetChannel.name);
  this.leave(channelName);
  onChange();
}
function subscribe(channelName, eventName, callback) {
  const targetChannel = getChannel.bind(this)(this.connector.channels, channelName);
  targetChannel.listen(eventName, res => {
    if (callback) callback(res);
  });
  if (this.options.debug) console.debug('[Echo] subscribeEvent -', targetChannel.name, eventName);
  onChange();
}
function unsubscribe(channelName, eventName) {
  const targetChannel = getChannel.bind(this)(this.connector.channels, channelName);
  targetChannel.stopListening(eventName);
  if (this.options.debug) console.debug('[Echo] unsubscribeEvent -', targetChannel.name, eventName);
  onChange();
}
function getChannels() {
  return this.connector.channels;
}
function getEvents(channelName) {
  const channel = Object.keys(this.connector.channels).find(key => key.includes(channelName));

  if (channel) {
    return this.connector.channels[channel].subscription.callbacks._callbacks;
  } else {
    const channels = this.connector.channels;
    let events = {};

    for (const channel of Object.keys(channels)) {
      events = { ...events,
        ...channels[channel].subscription.callbacks._callbacks
      };
    }

    return events;
  }
}

window.Pusher = require('pusher-js');
const defaultOptions = {
  broadcaster: 'pusher',
  forceTLS: true
};
let Echo;
const Plugin = {
  install(Vue, options = {}, store) {
    if (this.installed) {
      return;
    }

    this.installed = true;
    const config = Vue.util.mergeOptions(defaultOptions, options || {});
    const laravelEcho = new LaravelEcho(config);
    Vue.prototype.$echo = Echo = { ...laravelEcho
    };
    Object.setPrototypeOf(Echo, {
      onChange: addHookFunction,
      join: join.bind(laravelEcho),
      leave: leave.bind(laravelEcho),
      subscribe: subscribe.bind(laravelEcho),
      unsubscribe: unsubscribe.bind(laravelEcho),
      getChannels: getChannels.bind(laravelEcho),
      getChannel: getChannel.bind(laravelEcho),
      getEvents: getEvents.bind(laravelEcho)
    });
    Vue.mixin({
      mounted() {}

    });
  }

}; // This exports the plugin object.

export default Plugin;
export { Echo };
