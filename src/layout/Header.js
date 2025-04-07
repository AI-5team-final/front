import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import useAuth from '../hooks/useAuth';
import useToken from '../hooks/useToken';
import { useRef, useState, useEffect } from "react";
import { RiCopperCoinLine } from 'react-icons/ri'; // 아이콘 변경
import PaymentModal from '../components/PaymentModal';
import { useUser } from '../context/UserContext';

const Header = () => {
    const { userInfo } = useUser();
    const { logout } = useAuth();
    const { role, name } = useToken();
    const headerRef = useRef(null);
    const navigate = useNavigate(); // navigate 선언

    // Payment 모달 상태 관리
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const openPaymentModal = () => setIsPaymentModalOpen(true);
    const closePaymentModal = () => setIsPaymentModalOpen(false);
    
    useEffect(() => {
        const handleScroll = () => {
            if (headerRef.current) {
                headerRef.current.style.left = -window.scrollX + 'px';
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handlePageRedirect = () => {
        if (role === 'HR') {
            navigate('/postings'); // HR → 공고 관리
        } else {
            navigate('/resume'); // 지원자 → 이력서 관리
        }
    };

    return (
        <header ref={headerRef}>
            <div className="inner">
                <h1 className="logo">
                    <Link to="/"><img src="/images/logo.svg" alt="Rezoom Logo" /></Link>
                </h1>
                <div>
                    <p>
                        {role === 'HR' ? "함께 성장하는" : "취업 성공기원"}, <strong>{name}</strong>님 
                        <span></span>
                        <p className="coin-display" onClick={openPaymentModal} style={{ cursor: 'pointer' }}>
                            <RiCopperCoinLine /> 
                        </p>
                        <p onClick={openPaymentModal} style={{ cursor: 'pointer' }}>
                            {userInfo?.credit || 0}
                        </p>
                        <span></span>
                        <button 
                            className="button" 
                            onClick={handlePageRedirect} 
                            aria-label={role === 'HR' ? "공고 관리" : "이력서 관리"}
                        >
                            {role === 'HR' ? "공고 관리" : "이력서 관리"}
                        </button>
                        <span></span>
                    </p>
                    <button 
                        onClick={logout} 
                        aria-label="로그아웃"
                        role="button"
                        tabIndex={0}
                        className="btn-logout"
                    >
                        로그아웃
                    </button>
                    <button type="button" className="btn-menu">
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </div>
            {/* PaymentModal 컴포넌트를 조건부로 렌더링 */}
            <PaymentModal isOpen={isPaymentModalOpen} onRequestClose={closePaymentModal} />
        </header>
    );
};

export default Header;
