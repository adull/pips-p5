import { pipsImg, sg, h2p } from '../helpers/img';
import Borders from './Borders'

const Home = ({ style, setMode }) => {
    return (
        <div
            className="container mx-auto p-6 bg-white relative"
            style={{ ...style }}
            >
            <Borders />
            <div className="h-full w-full flex flex-col z-99 relative">
                <div className="flex-1 flex items-center justify-center">
                    <img
                        src={pipsImg}
                        className="w-200 object-contain"
                    />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center pl-6 pt-6 gap-6">
                    <img
                        src={sg}
                        onClick={() => setMode('game')}
                        className="w-100 object-contain cursor-pointer"
                    />

                    <img
                        src={h2p}
                        onClick={() => setMode('instructions')}
                        className="w-100  object-contain cursor-pointer"
                    />
                </div>
            </div>
        </div>

    );
}
    
export default Home;
