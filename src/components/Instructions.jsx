import { h2p2, okgotit } from '../helpers/img';
import Borders from './Borders'

const Instructions = ({ style, setMode }) => {
        return (
            <div className="container mx-auto p-6 bg-white relative"
                 style={{ ...style }}
            >
                <Borders />
                <div className="h-full w-full flex flex-col z-99">
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
        )
}

export default Instructions;
