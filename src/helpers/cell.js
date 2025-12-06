const cell = { w: 150, h: 150 }
const getCellSize = () => cell

const updateCellSize = (size) => { cell.w = size; cell.h = size; }

export { getCellSize, updateCellSize }