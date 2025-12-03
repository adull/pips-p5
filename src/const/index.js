const cell = { w: 100, h: 100 }

const getCellSize = () => {
    return cell
}
const setCellSize = (val) => {
    cell.w = val
    cell.h = val
}

export { getCellSize, setCellSize }