import { useEffect, useRef, useState } from "react";


const Cell = ({ cell }) => {
    
    return (
        <div className="border b-1 absolute" style={{ height: cell.h, width: cell.w, left: cell.x, top: cell.y, }}>
            haha
        </div>

    );
}

export default Cell;
