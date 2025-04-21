import { MdKeyboardArrowRight } from "react-icons/md";

const PaymentButton = ({ onClick, showArrow = true, className = "" }) => {
    return (
        <button type="button" onClick={onClick} className={className}>
            결제 내역 {showArrow && <MdKeyboardArrowRight className="icon-arrow" />}
        </button>
    );
};

export default PaymentButton;