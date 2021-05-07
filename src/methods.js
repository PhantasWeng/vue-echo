import { getChannel } from './helper'

export function join (channelName, options) {
  const { isPrivate } = options
  console.debug('[Echo] joinChannel -', isPrivate ? 'private-' + channelName : channelName)
  isPrivate ? this.private(channelName) : this.channel(channelName)
}

export function leave (channelName) {
  const targetChannel = getChannel(this.connector.channels, channelName)
  console.debug('[Echo] leaveChannel -', targetChannel.name)
  this.leave(channelName)
}

export function subscribe (channelName, eventName, callback) {
  const targetChannel = getChannel(this.connector.channels, channelName)
  targetChannel.listen(eventName, (res) => {
    if (callback) callback(res)
  })

  console.debug('[Echo] subscribeEvent -', targetChannel.name, eventName)
}

export function unsubscribe (channelName, eventName) {
  const targetChannel = getChannel(this.connector.channels, channelName)
  targetChannel.stopListening(eventName)

  console.debug('[Echo] unsubscribeEvent -', targetChannel.name, eventName)
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
