
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { RiCopperCoinLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

import PaymentModal from "../components/PaymentModal";
import { useUser } from "../context/UserContext";
import useAuth from "../hooks/useAuth";
import useToken from "../hooks/useToken";


const Header = () => {
    const { userInfo } = useUser();
    const { logout } = useAuth();
    const { role } = useToken();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const openPaymentModal = () => {
        setIsMenuOpen(false);
        setIsPaymentModalOpen(true);
    };
    const closePaymentModal = () => setIsPaymentModalOpen(false);

    const handlePageRedirect = () => {
        setIsMenuOpen(false);
        navigate(role === "HR" ? "/postings" : "/resume");
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1023) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            {/* 결제 모달 */}
            <PaymentModal isOpen={isPaymentModalOpen} onRequestClose={closePaymentModal} />

            {/* Header */}
            <header>
                <div className="inner">
                    <h1 className="logo">
                        <Link to="/">
                            <img src="/images/logo.svg" alt="Rezoom Logo" />
                        </Link>
                    </h1>

                    <div>
                        <p>
                            {role === "HR" ? "함께 성장하는" : "취업 성공기원"},{" "}
                            <strong>{userInfo?.name}</strong>님
                        </p>
                        <span></span>
                        <p className="coin-display" onClick={openPaymentModal} style={{ cursor: "pointer" }}>
                            <RiCopperCoinLine /> {userInfo?.credit ?? 0}
                        </p>
                        <span></span>
                        <button type="button" onClick={handlePageRedirect}>
                            {role === "HR" ? "공고 관리" : "이력서 관리"}
                        </button>
                        <button onClick={logout} className="btn-logout">로그아웃</button>
                        {!isMenuOpen && (
                            <button type="button" className="btn-menu" onClick={toggleMenu}>
                                <RxHamburgerMenu className="icon-menu" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* 사이드 메뉴 (항상 렌더링) */}
            <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
                
                <button className="close-btn" onClick={toggleMenu}>
                    <IoClose />
                </button>
                
                <div className="side-menu-cont">
                    <p>안녕하세요 <strong>{userInfo?.name}</strong>님</p>
                    <p className="coin-display" onClick={openPaymentModal}>
                        <RiCopperCoinLine /> {userInfo?.credit ?? 0}
                    </p>
                    <button onClick={handlePageRedirect}>이력서 관리</button>
                </div>
                <button onClick={logout} className="btn-logout">로그아웃</button>
            </div>

            {/* 딤드 백그라운드 */}
            {isMenuOpen && <div className="dimmed-bg" onClick={() => setIsMenuOpen(false)} />}
        </>
    );
};

export default Header;