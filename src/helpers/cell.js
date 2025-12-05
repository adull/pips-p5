const cell = { w: 80, h: 80}
const getCellSize = () => cell

const setCellSize = (size) => { cell.w = size; cell.h = size; }

export { getCellSize, setCellSize }