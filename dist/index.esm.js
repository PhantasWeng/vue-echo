import LaravelEcho from 'laravel-echo';

function getChannel(channels, channelName) {
  const target = Object.keys(channels).find(channel => channels[channel].name.replace('private-', '') === channelName);

  if (!target) {
    throw new Error(`[Echo] Channel name not exist: ${channelName}`);
  }

  return channels[target];
}

function join(channelName, options) {
  const {
    isPrivate
  } = options;
  console.debug('[Echo] joinChannel -', isPrivate ? 'private-' + channelName : channelName);
  isPrivate ? this.private(channelName) : this.channel(channelName);
}
function leave(channelName) {
  const targetChannel = getChannel(this.connector.channels, channelName);
  console.debug('[Echo] leaveChannel -', targetChannel.name);
  this.leave(channelName);
}
function subscribe(channelName, eventName, callback) {
  const targetChannel = getChannel(this.connector.channels, channelName);
  targetChannel.listen(eventName, res => {
    if (callback) callback(res);
  });
  console.debug('[Echo] subscribeEvent -', targetChannel.name, eventName);
}
function unsubscribe(channelName, eventName) {
  const targetChannel = getChannel(this.connector.channels, channelName);
  targetChannel.stopListening(eventName);
  console.debug('[Echo] unsubscribeEvent -', targetChannel.name, eventName);
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
