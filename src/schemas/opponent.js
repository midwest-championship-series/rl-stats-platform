module.exports = (stats) => {
  return stats.reduce((result, item) => {
    const concat = [item]
    if (!item.skipOpponent) {
      concat.push({ name: `opponent_${item.name}`, type: item.type })
    }
    return result.concat(concat)
  }, [])
}
