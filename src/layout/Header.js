import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import useAuth from '../hooks/useAuth';
import useToken from '../hooks/useToken';
import { useRef } from "react";
import { RiCopperCoinLine } from 'react-icons/ri'; // 아이콘 변경
import { useUser } from '../context/UserContext';

const Header = () => {
    const { userInfo } = useUser();
    const { logout } = useAuth();
    const { role, name } = useToken();
    const { userInfo } = useUser();
    const headerRef = useRef(null);
    const navigate = useNavigate(); // navigate 선언


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
                    </p>
                    <span></span>
                    <p className="coin-display">
                        <RiCopperCoinLine /> 
                    </p>
                    <p>{userInfo? userInfo.credit : 0}</p>
                    <span></span>
                    <button 
                        className="button" 
                        onClick={handlePageRedirect} 
                        aria-label={role === 'HR' ? "공고 관리" : "이력서 관리"}
                    >
                        {role === 'HR' ? "공고 관리" : "이력서 관리"}
                    </button>
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
        </header>
    );
};

export default Header;
