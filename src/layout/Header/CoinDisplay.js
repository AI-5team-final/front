import { RiCopperCoinLine } from "react-icons/ri";

const CoinDisplay = ({ credit, onClick }) => {
    return (
        <p className="coin-display tutorial-credit" onClick={onClick} style={{ cursor: "pointer" }}>
            <RiCopperCoinLine />{" "}
            {credit ? new Intl.NumberFormat().format(credit) : 0}
        </p>
    );
};

export default CoinDisplay; 