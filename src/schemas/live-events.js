const standard = (filler) => {
  return (event) => {
    return [event.data.main_target.name, filler, event.data.type.toLowerCase()].join(' ')
  }
}

module.exports = (event) => {
  const eventTypes = [
    // {key: 'Win', processor: standard},
    { key: 'MVP', processor: standard('got the') },
    { key: 'Goal', processor: standard('scored a') },
    { key: 'Aerial Goal', processor: standard('scored an') },
    { key: 'Backwards Goal', processor: standard('scored a') },
    { key: 'Bicycle Goal', processor: standard('scored a') },
    { key: 'Long Goal', processor: standard('scored a') },
    { key: 'Overtime Goal', processor: standard('scored an') },
    { key: 'Hat Trick', processor: standard('got a') },
    { key: 'Turtle Goal', processor: standard("lookin' big with a") },
    { key: 'Assist', processor: standard('got the') },
    { key: 'Playmaker', processor: standard('is now a') },
    { key: 'Save', processor: standard('got a') },
    { key: 'Epic Save', processor: standard('got an') },
    { key: 'Savior', processor: standard('became a') },
    { key: 'Shot on Goal', processor: standard('put a') },
    // { key: 'Center Ball', processor: (event) => `${event.data.main_target.name} centered the ball` },
    // { key: 'Clear Ball', processor: (event) => `${event.data.main_target.name} cleared the ball` },
    // { key: 'Aerial Hit', processor: standard('') },
    // { key: 'Bicycle Hit', processor: standard('') },
    // { key: 'Juggle', processor: standard('') },
    {
      key: 'Demolition',
      processor: (event) => `${event.data.main_target.name} demoed ${event.data.secondary_target.name}`,
    },
    { key: 'Extermination', processor: (event) => `${event.data.main_target.name} just got an extermination` },
    // { key: 'First Touch', processor: standard('') },
    { key: 'Pool Shot', processor: (event) => `${event.data.main_target.name} went for the poolshot` },
    // { key: 'Low Five', processor: standard('') },
    // { key: 'High Five', processor: standard('') },
    // { key: 'Damage', processor: standard('') },
    // { key: 'Ultra Damage', processor: standard('') },
    // { key: 'Swish Goal', processor: standard('') },
  ]

  const match = eventTypes.find((type) => event.data && event.data.type === type.key)
  if (match) return match.processor(event)
}
