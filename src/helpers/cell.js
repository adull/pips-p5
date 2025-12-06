const cell = { w: 100, h: 100 }
const getCellSize = () => cell

const updateCellSize = (size) => { cell.w = size; cell.h = size; }

export { getCellSize, updateCellSize }