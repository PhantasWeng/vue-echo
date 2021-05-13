var vueEcho = (function (exports, LaravelEcho) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var LaravelEcho__default = /*#__PURE__*/_interopDefaultLegacy(LaravelEcho);

  function getChannel(channels, channelName) {
    const target = Object.keys(channels).find(channel => channels[channel].name.replace('private-', '') === channelName);
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
  exports.Echo = void 0;
  const Plugin = {
    install(Vue, options = {}, store) {
      if (this.installed) {
        return;
      }

      this.installed = true;
      const config = Vue.util.mergeOptions(defaultOptions, options || {});
      const laravelEcho = new LaravelEcho__default['default'](config);
      Vue.prototype.$echo = exports.Echo = { ...laravelEcho
      };
      Object.setPrototypeOf(exports.Echo, {
        join: join.bind(laravelEcho),
        leave: leave.bind(laravelEcho),
        subscribe: subscribe.bind(laravelEcho),
        unsubscribe: unsubscribe.bind(laravelEcho),
        getChannels: getChannels.bind(laravelEcho),
        getEvents: getEvents.bind(laravelEcho)
      });
      Vue.mixin({
        mounted() {}

      });
    }

  }; // This exports the plugin object.

  exports.default = Plugin;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}, LaravelEcho));
