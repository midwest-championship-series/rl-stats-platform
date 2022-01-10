module.exports = (stats) => {
  return stats.reduce((result, item) => {
    if (!item.skipOpponent) {
      return [...result, item, { name: `opponent_${item.name}`, type: item.type }]
    } else {
      return [...result, item]
    }
  }, [])
}
