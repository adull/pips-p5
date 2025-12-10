//board
let board = []
const getBoard = () => board
const pushToBoard = (cell) => board.push(cell)
const addValToCell = (val, cellId) => {
    const target = board.find(item => item.id === cellId)
    target.val = val
}
const clearBoard = () => board = []
const getValFromCell = (cellId) => {
    const target = board.find(item => item.id === cellId)
    return target?.val
}
const findCell = (id) => board.find(cell => cell.id === id ? cell : null )

//offset
let offset = { x: 0, y: 0 }
const getOffset = () => offset
const setOffset = (newOffset) => offset = newOffset

//cells
const cell = { w: 100, h: 100 }
const getCellSize = () => cell

const updateCellSize = (size) => { cell.w = size; cell.h = size; }

//dice
let originalDicePos = []

const getOriginalDicePos = () => originalDicePos

const getOriginalDicePosWithId = (id) => originalDicePos.find(item => item.id === id)

const pushToOriginalDicePos = (item) => originalDicePos.push(item)

const clearOriginalDicePos = () => originalDicePos = []

// regions
let regions = []
const getRegions = () => regions
const setRegions = (r) => regions = r

export { 
    clearBoard, getBoard, pushToBoard, addValToCell, getValFromCell, findCell, 
    getOffset, setOffset,
    getCellSize, updateCellSize,
    getOriginalDicePos, getOriginalDicePosWithId, pushToOriginalDicePos, clearOriginalDicePos,
    getRegions, setRegions
}