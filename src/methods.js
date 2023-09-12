import { getChannel } from './helper'

const hooks = []

export function addHookFunction (func) {
  hooks.push(func)
}

export function onChange (...params) {
  hooks.forEach(func => func(...params))
}

export function join (channelName, options) {
  const { isPrivate } = options
  if (this.options.debug) console.debug('[Echo] joinChannel -', isPrivate ? 'private-' + channelName : channelName)
  isPrivate ? this.private(channelName) : this.channel(channelName)
  onChange()
}

export function leave (channelName) {
  const targetChannel = getChannel.bind(this)(this.connector.channels, channelName)
  if (this.options.debug) console.debug('[Echo] leaveChannel -', targetChannel.name)
  this.leave(channelName)
  onChange()
}

export function subscribe (channelName, eventName, callback) {
  const targetChannel = getChannel.bind(this)(this.connector.channels, channelName)
  targetChannel.listen(eventName, (res) => {
    if (callback) callback(res)
  })

  if (this.options.debug) console.debug('[Echo] subscribeEvent -', targetChannel.name, eventName)
  onChange()
}

export function unsubscribe (channelName, eventName) {
  const targetChannel = getChannel.bind(this)(this.connector.channels, channelName)
  targetChannel.stopListening(eventName)

  if (this.options.debug) console.debug('[Echo] unsubscribeEvent -', targetChannel.name, eventName)
  onChange()
}

export function getChannels () {
  return this.connector.channels
}

export function getEvents (channelName) {
  const channel = Object.keys(this.connector.channels).find(key => key.includes(channelName))
  if (channel) {
    return this.connector.channels[channel].subscription.callbacks._callbacks
  } else {
    const channels = this.connector.channels
    let events = {}
    for (const channel of Object.keys(channels)) {
      events = {
        ...events,
        ...channels[channel].subscription.callbacks._callbacks
      }
    }
    return events
  }
}
