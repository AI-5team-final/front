import { IoClose } from "react-icons/io5";
import { RiCopperCoinLine } from "react-icons/ri";
import { MdKeyboardArrowRight } from "react-icons/md";

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
                    <p>
                        안녕하세요 <strong>{userInfo?.name}</strong>님
                    </p>
                    {role !== "HR" && (
                        <>
                            <p className="coin-display" onClick={onPaymentClick} style={{ cursor: "pointer" }}>
                                <RiCopperCoinLine />{" "}
                                {userInfo?.credit ? new Intl.NumberFormat().format(userInfo.credit) : 0}
                            </p>
                            <button type="button" onClick={() => onPageRedirect("payment")}>
                                결제 내역 <MdKeyboardArrowRight className="icon-arrow" />
                            </button>
                        </>
                    )}
                    <button onClick={() => onPageRedirect("resume")}>
                        {role === "HR" ? "공고 관리" : "이력서 관리"} <MdKeyboardArrowRight className="icon-arrow" />
                    </button>
                </div>
                <button onClick={onLogout} className="btn-logout">
                    로그아웃
                </button>
            </div>
            {isOpen && <div className="dimmed-bg" onClick={onClose} />}
        </>
    );
};

export default Sidebar; 