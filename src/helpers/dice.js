let originalDicePos = []

const getOriginalDicePos = () => originalDicePos

const getOriginalDicePosWithId = (id) => originalDicePos.find(item => item.id === id)

const pushToOriginalDicePos = (item) => originalDicePos.push(item)

const clearOriginalDicePos = () => originalDicePos = []

export { getOriginalDicePos, getOriginalDicePosWithId, pushToOriginalDicePos, clearOriginalDicePos }