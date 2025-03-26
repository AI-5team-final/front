import { Link } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import { useEffect, useRef, useState } from "react";

const Header = () => {
    const role = useRole();
    const { logout } = useAuth();
    const [name, setName] = useState("테스트");
    const headerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (headerRef.current) {
                headerRef.current.style.left = -window.scrollX + 'px';
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Cleanup
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    
    return (
        <header ref={headerRef}>
            <div className="inner">
                <h1 className="logo">
                    <Link to="/"><img src="/images/logo.svg" alt="Rezoom Logo" /></Link>
                </h1>
                <div>
                    <p>{role==='HR'? "함께 성장하는" : "취업 성공기원"}, <strong>{name}</strong>님</p>
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

}
export default Header;