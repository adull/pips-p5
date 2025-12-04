const board = []
const getBoard = () => board

const pushToBoard = (cell) => board.push(cell)

const findCell = (id) => board.find(cell => cell.id === id ? cell : null )

export { getBoard, pushToBoard, findCell }