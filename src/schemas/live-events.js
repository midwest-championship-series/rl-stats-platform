const standard = (filler) => {
  return (event) => {
    return [event.data.main_target.name, filler, event.data.type.toLowerCase()].join(' ')
  }
}

module.exports = (event) => {
  const eventTypes = [
    // {key: 'Win', processor: standard},
    { key: 'MVP', processor: (event) => `${event.data.main_target.name} is the :star: MVP :star_struck:` },
    {
      key: 'Goal',
      processor: (event) => `${event.data.main_target.name} scored a :goal: :soccer: :race_car: GOOOOOOAAAAALLLLLL!!!`,
    },
    { key: 'Aerial Goal', processor: standard('scored an') },
    { key: 'Backwards Goal', processor: standard('scored a') },
    { key: 'Bicycle Goal', processor: (event) => `It was a :person_biking_tone1: bicycle goal` },
    { key: 'Long Goal', processor: standard('scored a') },
    { key: 'Overtime Goal', processor: (event) => `${event.data.main_target.name} put in the :clock: overtime goal` },
    { key: 'Hat Trick', processor: standard('got a') },
    { key: 'Turtle Goal', processor: standard("lookin' big with a") },
    { key: 'Assist', processor: (event) => `${event.data.main_target.name} got the :handshake: assist` },
    { key: 'Playmaker', processor: standard('is now a') },
    { key: 'Save', processor: (event) => `${event.data.main_target.name} made a save :cold_sweat: ` },
    { key: 'Epic Save', processor: (event) => `${event.data.main_target.name} made an epic save :hot_face:` },
    {
      key: 'Savior',
      processor: (event) => `${event.data.main_target.name} became a savior :angel_tone1:`,
    },
    {
      key: 'Shot on Goal',
      processor: (event) => `${event.data.main_target.name} put a :soccer: shot on goal`,
    },
    // { key: 'Center Ball', processor: (event) => `${event.data.main_target.name} centered the ball` },
    // { key: 'Clear Ball', processor: (event) => `${event.data.main_target.name} cleared the ball` },
    // { key: 'Aerial Hit', processor: standard('') },
    // { key: 'Bicycle Hit', processor: standard('') },
    // { key: 'Juggle', processor: standard('') },
    {
      key: 'Demolition',
      processor: (event) =>
        `${event.data.main_target.name} demoed :exploding_head: ${event.data.secondary_target.name}`,
    },
    {
      key: 'Extermination',
      processor: (event) => `${event.data.main_target.name} just got an :skull: extermination :skull: `,
    },
    // { key: 'First Touch', processor: standard('') },
    { key: 'Pool Shot', processor: (event) => `${event.data.main_target.name} did a :8ball: poolshot :8ball:` },
    // { key: 'Low Five', processor: standard('') },
    // { key: 'High Five', processor: standard('') },
    // { key: 'Damage', processor: standard('') },
    // { key: 'Ultra Damage', processor: standard('') },
    // { key: 'Swish Goal', processor: standard('') },
  ]

  const match = eventTypes.find((type) => event.data && event.data.type === type.key)
  if (match) return match.processor(event)
}
