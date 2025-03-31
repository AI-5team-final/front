import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import useAuth from '../hooks/useAuth';
import useToken from '../hooks/useToken';
import { useEffect, useRef } from "react";

const Header = () => {
    const { logout } = useAuth();
    const { role, name } = useToken();
    const headerRef = useRef(null);
    const navigate = useNavigate(); // navigate 선언

    const headerStyle = {
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        zIndex: 1000
    };

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
            navigate('/job-postings'); // HR → 공고 관리
        } else {
            navigate('/resume'); // 지원자 → 이력서 관리
        }
    };

    return (
        <header ref={headerRef} style={headerStyle}>
            <div className="inner">
                <h1 className="logo">
                    <Link to="/"><img src="/images/logo.svg" alt="Rezoom Logo" /></Link>
                </h1>
                <div>
                    <p>{role === 'HR' ? "함께 성장하는" : "취업 성공기원"}, <strong>{name}</strong>님</p>
                    <span></span>
                    <button 
                        onClick={handlePageRedirect} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        aria-label={role === 'HR' ? "공고 관리" : "이력서 관리"}
                        role="button"
                        tabIndex={0}
                    >
                        {role === 'HR' ? "공고 관리" : "이력서 관리"}
                    </button>
                    <span></span>
                    <button 
                        onClick={logout} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        aria-label="로그아웃"
                        role="button"
                        tabIndex={0}
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
