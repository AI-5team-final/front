import PaymentModal from "../modal/PaymentModal";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Toolbar from "./Header/Toolbar";
import Sidebar from "./Header/Sidebar";


const Header = () => {
    const { userInfo, logout } = useAuth();
    const role = userInfo?.role;
    
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
            } else {
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
                <Toolbar 
                    onMenuClick={toggleMenu}
                    onPaymentClick={openPaymentModal}
                    onLogout={logout}
                    onPageRedirect={handlePageRedirect}
                    userInfo={userInfo}
                    role={role}
                />
            </header>

            <Sidebar 
                isOpen={isMenuOpen}
                onClose={toggleMenu}
                onPaymentClick={openPaymentModal}
                onLogout={logout}
                onPageRedirect={handlePageRedirect}
                userInfo={userInfo}
                role={role}
            />
        </>
    );
};

export default Header;
