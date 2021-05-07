export function getChannel (channels, channelName) {
  const target = Object.keys(channels).find(channel => channels[channel].name.replace('private-', '') === channelName)
  return channels[target]
}
