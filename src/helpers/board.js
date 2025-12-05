const board = []
const getBoard = () => board
const pushToBoard = (cell) => board.push(cell)
const addValToCell = (val, cellId) => {
    const target = board.find(item => item.id === cellId)
    target.val = val
}
const getValFromCell = (cellId) => {
    const target = board.find(item => item.id === cellId)
    return target?.val
}
const findCell = (id) => board.find(cell => cell.id === id ? cell : null )

let offset = { x: 0, y: 0 }
const getOffset = () => offset
const setOffset = (newOffset) => offset = newOffset

export { 
    getBoard, pushToBoard, addValToCell, getValFromCell, findCell, 
    getOffset, setOffset 
}