const originalDicePos = []

const getOriginalDicePos = () => originalDicePos

const getOriginalDicePosWithId = (id) => originalDicePos.find(item => item.id === id)

const pushToOriginalDicePos = (item) => originalDicePos.push(item)

export { getOriginalDicePos, getOriginalDicePosWithId, pushToOriginalDicePos }