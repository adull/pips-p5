import { leftBorder, rightBorder, bak, h2p2, okgotit } from '../helpers/img';

const Instructions = ({ style, setMode }) => {
        return (
            <>
            <div className="container mx-auto p-6 absolute top-0 left-0" style={{ width: style.width, height: '50px'}}>
                <img src={bak} onClick={() => setMode('home')} className="w-30" /> 
                
            </div>
            <div className="container mx-auto p-6 bg-white relative"
                 style={{ ...style }}
            >
                <div className="absolute top-0 left-0 h-full" >
                    <img src={leftBorder} className="object-contain h-full" />
                </div>
                <div className="absolute top-0 right-0 h-full" >
                    <img src={rightBorder} className="object-contain h-full" />
                </div>
                <div className="h-full w-full flex flex-col">
                    <div className="flex-1 flex justify-center">
                        <img
                            src={h2p2}
                            className="w-100 object-contain"
                        />
                    </div>
                    <div className="flex-1 flex justify-center items-center">
                        <ul>
                            <li>Click to rotate dominos</li>
                            <li>Drag dominos onto board</li>
                            <li>Satisfy the outlined regions</li>
                        </ul>
                    </div>
                    <div className="flex-1 flex justify-center cursor-pointer">
                        <img
                            src={okgotit}
                            className="w-100 object-contain"
                            onClick={() => setMode('home')}
                        />
                    </div>
                </div>
            </div>
            </>
        )
}

export default Instructions;
