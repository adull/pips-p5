import { zero, one, two, three, fo, five, six } from '../helpers/pips-img'

const Pip = ({ first, val }) => {
    const map = {
        0: zero,
        1: one,
        2: two,
        3: three,
        4: fo,
        5: five,
        6: six
    }

    return (
        <div className={`flex flex-wrap justify-center items-center ${first ? `border-r-1` : ``}`} >
            <img className="select-none pointer-events-none" src={map[val]} style={{padding: '1rem'}} />
        </div>
    )
}

export default Pip