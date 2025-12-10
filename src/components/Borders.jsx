import { leftBorder, rightBorder } from "../helpers/img"
const Borders = () => {
    return (
        <>
            <div className="absolute top-0 h-full z-0" style={{left: -30}} >
                <img src={leftBorder} className="object-contain h-full" />
            </div>
            <div className="absolute top-0 h-full" style={{right: -30}}>
                <img src={rightBorder} className="object-contain h-full" />
            </div>
        </>
    )
}

export default Borders