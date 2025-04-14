import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { RiCopperCoinLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { useUser } from "../context/UserContext";
import PaymentModal from "../modal/PaymentModal";
import useAuth from "../hooks/useAuth";
import useToken from "../hooks/useToken";
import { MdKeyboardArrowRight } from "react-icons/md";

const Header = () => {
    const { userInfo } = useUser();
    const { logout } = useAuth();
    const { role } = useToken();
    const navigate = useNavigate();
    const headerRef = useRef(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const openPaymentModal = () => {
        setIsMenuOpen(false);
        setIsPaymentModalOpen(true);
    };
    const closePaymentModal = () => setIsPaymentModalOpen(false);

    // 매개변수 destination에 따라 분기하여 경로를 결정하는 함수
    const handlePageRedirect = (destination) => {
        setIsMenuOpen(false);
        if (destination === "payment") {
            navigate("/dashboard");
        } else {
            navigate(role === "HR" ? "/postings" : "/resume");
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > headerRef.current.style.height) {
                headerRef.current.classList.add("active");
            }else {
                headerRef.current.classList.remove("active");
            }
        };

        window.addEventListener("scroll", handleScroll);

        const handleResize = () => {
            if (window.innerWidth > 1023) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };

       

    }, []);

    return (
        <>
            {/* 결제 모달 */}
            <PaymentModal isOpen={isPaymentModalOpen} onRequestClose={closePaymentModal} />

            {/* Header */}
            <header ref={headerRef}>
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
                        <p className="coin-display" onClick={openPaymentModal} style={{ cursor: "pointer" }}>
                            <RiCopperCoinLine />{" "}
                            {userInfo?.credit ? new Intl.NumberFormat().format(userInfo.credit) : 0}
                        </p>
                        <span></span>
                        <button type="button" onClick={() => handlePageRedirect("payment")}>
                            결제 내역
                        </button>
                        <span></span>
                        <button type="button" onClick={() => handlePageRedirect("resume")}>
                            {role === "HR" ? "공고 관리" : "이력서 관리"}
                        </button>
                        <button onClick={logout} className="btn-logout">
                            로그아웃
                        </button>
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
                    <p>
                        안녕하세요 <strong>{userInfo?.name}</strong>님
                    </p>
                    <p className="coin-display" onClick={openPaymentModal} style={{ cursor: "pointer" }}>
                        <RiCopperCoinLine />{" "}
                        {userInfo?.credit ? new Intl.NumberFormat().format(userInfo.credit) : 0}
                    </p>
                    <button type="button" onClick={() => handlePageRedirect("payment")}>
                        결제 내역 <MdKeyboardArrowRight className="icon-arrow" />
                    </button>
                    
                    <button onClick={() => handlePageRedirect("resume")}>
                        이력서 관리 <MdKeyboardArrowRight className="icon-arrow" />
                    </button>
                </div>
                <button onClick={logout} className="btn-logout">
                    로그아웃
                </button>
            </div>

            {/* 딤드 백그라운드 - X 버튼 외에도 바탕화면을 누르면 메뉴 닫힘 */}
            {isMenuOpen && <div className="dimmed-bg" onClick={toggleMenu} />}
        </>
    );
};

export default Header;
