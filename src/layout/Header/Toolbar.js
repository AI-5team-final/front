import { Link } from "react-router-dom";
import { RiCopperCoinLine } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";

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
                <p>
                    <span>{role === "HR" ? "함께 성장하는" : "취업 성공기원"},{" "}</span>
                    <strong>{userInfo?.name}</strong>님
                </p>
                <span></span>
                {role !== "HR" && (
                    <>
                        <p className="coin-display" onClick={onPaymentClick} style={{ cursor: "pointer" }}>
                            <RiCopperCoinLine />{" "}
                            {userInfo?.credit ? new Intl.NumberFormat().format(userInfo.credit) : 0}
                        </p>
                        <span></span>
                        <button type="button" onClick={() => onPageRedirect("payment")}>
                            결제 내역
                        </button>
                        <span></span>
                    </>
                )}
                <button type="button" onClick={() => onPageRedirect("resume")}>
                    {role === "HR" ? "공고 관리" : "이력서 관리"}
                </button>
                <button onClick={onLogout} className="btn-logout">
                    로그아웃
                </button>
                <button type="button" className="btn-menu" onClick={onMenuClick}>
                    <RxHamburgerMenu className="icon-menu" />
                </button>
            </div>
        </div>
    );
};

export default Toolbar; 