import { useEffect, useRef, useState } from "react";


const Region = ({ region }) => {
    const [regionCells, setRegionCells] = useState([])
    useEffect(() => {
        console.log(region)
    }, [region])
    
    return (
        <>
        {regionCells.map(regionCell => {
            <div>regioncell..</div>
        })}
        </>
        

    );
}

export default Region;
