import { w, i, n1, n2, e, r, exclam1, exclam2, exclam3 } from '../helpers/img';


const WinnerModal = ({ time, style, newPuzzle }) => {
    const imgs = [w, i, n1, n2, e, r, exclam1, exclam2, exclam3]
    return (
        <div className="absolute top-0 left-0" style={style}>
            <div
                className="relative bg-white flex flex-col p-6 items-center w-full md:w-1/2"
                style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
            >
                <div className="flex justify-around">
                {imgs.map(item => {
                    return (
                        <img style={{width: '11%', height: "auto"}} src={item} />
                    )
                })}
                </div>
                <div className="my-4">Finished in {time}</div>
                <button className="border b-1 cursor-pointer p-4" onClick={newPuzzle}>New puzzle</button>
            </div>
        </div>
        
    );
}

export default WinnerModal;
