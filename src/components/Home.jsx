import { leftBorder, rightBorder, pipsImg, sg, h2p } from '../helpers/img';

const Home = ({ style, setMode }) => {
    return (
        <div
            className="container mx-auto p-6 bg-white relative"
            style={{ ...style }}
            >
            <div className="absolute top-0 left-0 h-full" >
                <img src={leftBorder} className="object-contain h-full" />
            </div>
            <div className="absolute top-0 right-0 h-full" >
                <img src={rightBorder} className="object-contain h-full" />
            </div>
            <div className="h-full w-full flex flex-col">
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
