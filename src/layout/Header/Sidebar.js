import { IoClose } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import UserTitle from "./UserTitle";
import CoinDisplay from "./CoinDisplay";
import PaymentButton from "./PaymentButton";
import ManagementButton from "./ManagementButton";
import LogoutButton from "./LogoutButton";

const Sidebar = ({ 
    isOpen, 
    onClose, 
    onPaymentClick, 
    onLogout, 
    onPageRedirect,
    userInfo,
    role
}) => {
    return (
        <>
            <div className={`side-menu ${isOpen ? "open" : ""}`}>
                <button className="close-btn" onClick={onClose}>
                    <IoClose />
                </button>
                <div className="side-menu-cont">
                    <UserTitle role={role} name={userInfo?.name} />
                    {role !== "HR" && (
                        <>
                            <CoinDisplay credit={userInfo?.credit} onClick={onPaymentClick} />
                            <PaymentButton onClick={() => onPageRedirect("payment")} />
                        </>
                    )}
                    <ManagementButton onClick={() => onPageRedirect("resume")} role={role} showArrow={true} />
                </div>
                <LogoutButton onClick={onLogout} />
            </div>
            {isOpen && <div className="dimmed-bg" onClick={onClose} />}
        </>
    );
};

export default Sidebar; 