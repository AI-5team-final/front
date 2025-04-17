import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import UserTitle from "./UserTitle";
import CoinDisplay from "./CoinDisplay";
import PaymentButton from "./PaymentButton";

const Toolbar = ({ 
    onMenuClick, 
    onPaymentClick, 
    onLogout, 
    onPageRedirect,
    userInfo,
    role
}) => {
    return (
        <div className="inner">
            <h1 className="logo">
                <Link to="/">
                    <img src="/images/logo.svg" alt="Rezoom Logo" />
                </Link>
            </h1>

            <div>
                <UserTitle role={role} name={userInfo?.name} />
                <span></span>
                {role !== "HR" && (
                    <>
                        <CoinDisplay credit={userInfo?.credit} onClick={onPaymentClick} />
                        <span></span>
                        <PaymentButton onClick={() => onPageRedirect("payment")} showArrow={false} />
                        <span></span>
                    </>
                )}
                <button type="button" onClick={() => onPageRedirect("resume")}>
                    {role === "HR" ? "공고 관리" : "이력서 관리"}
                </button>
                <button onClick={onLogout} className="btn-logout">
                    로그아웃
                </button>
                {/* TODO: 햄버거버튼 Sidebar.js로 옮기기 */}
                <button type="button" className="btn-menu" onClick={onMenuClick}>
                    <RxHamburgerMenu className="icon-menu" />
                </button>
            </div>
        </div>
    );
};

export default Toolbar; 