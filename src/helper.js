export function getChannel (channels, channelName) {
  const target = Object.keys(channels).find(channel => channels[channel].name.replace('private-', '') === channelName)
  if (!target) {
    throw new Error(`[Echo] Channel name not exist: ${channelName}`)
  }
  return channels[target]
}
