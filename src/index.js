import LaravelEcho from 'laravel-echo'
import { getChannel } from './helper'
import { addHookFunction, join, leave, subscribe, unsubscribe, getChannels, getEvents } from './methods'
window.Pusher = require('pusher-js')

const defaultOptions = {
  broadcaster: 'pusher',
  forceTLS: true
}

let Echo

const Plugin = {
  install (Vue, options = {}, store) {
    if (this.installed) {
      return
    }
    this.installed = true

    const config = Vue.util.mergeOptions(defaultOptions, options || {})
    const laravelEcho = new LaravelEcho(config)

    Vue.prototype.$echo = Echo = {
      ...laravelEcho
    }
    Object.setPrototypeOf(Echo, {
      onChange: addHookFunction,
      join: join.bind(laravelEcho),
      leave: leave.bind(laravelEcho),
      subscribe: subscribe.bind(laravelEcho),
      unsubscribe: unsubscribe.bind(laravelEcho),
      getChannels: getChannels.bind(laravelEcho),
      getChannel: getChannel.bind(laravelEcho),
      getEvents: getEvents.bind(laravelEcho)
    })
    Vue.mixin({
      mounted () {
      }
    })
  }
}

// This exports the plugin object.
export default Plugin

export {
  Echo
}
