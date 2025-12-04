const board = []
const getBoard = () => board
const pushToBoard = (cell) => board.push(cell)
const findCell = (id) => board.find(cell => cell.id === id ? cell : null )

let offset = { x: 0, y: 0 }
const getOffset = () => offset
const setOffset = (newOffset) => offset = newOffset

export { getBoard, pushToBoard, findCell, getOffset, setOffset }