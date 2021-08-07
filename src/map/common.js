const getPlayerTeamsAtDate = (player, matchDate) => {
  return player.team_history.filter(
    (item) => item.date_joined < matchDate && (!item.date_left || item.date_left > matchDate),
  )
}

module.exports = { getPlayerTeamsAtDate }
