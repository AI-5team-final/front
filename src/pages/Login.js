import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../layout/Footer';
import useAuth from '../hooks/useAuth';
import '../styles/Login.scss';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const { login, isLoggedIn, setUser } = useAuth(); 
    const [activeTab, setActiveTab] = useState('APPLICANT');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [clipPosition, setClipPosition] = useState({ x: 0, y: 0 });
    const [animationKey, setAnimationKey] = useState(0);
    const [isInitialRender, setIsInitialRender] = useState(true);

    // 로그인 상태면 로그인 페이지 접근 시 자동 리다이렉트
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const handleTabClick = (tab, e) => {
        if (tab === activeTab) return;
        
        const x = e.clientX;
        const y = e.clientY;
        
        setClipPosition({ x, y });
        setActiveTab(tab);
        setAnimationKey(prev => prev + 1);
        setIsInitialRender(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const userRole = activeTab === 'APPLICANT' ? 'APPLICANT' : 'HR';
            const data = await login(username, password, userRole);
            
            setUser({ ...data, accessToken: data.accessToken });
            toast.success('로그인 성공!');
            
        } catch (err) {
            setError(err.message);
            setUser({ userInfo: null, isLoggedIn: false });
            console.error('[CLIENT ERROR]', error);
        }
    };
    
    return (
        <div className="page-container">
            <div 
                key={animationKey}
                className={`background-animation ${activeTab.toLowerCase()} ${isInitialRender ? 'initial' : ''}`} 
                style={{
                    '--clip-position-x': `${clipPosition.x}px`,
                    '--clip-position-y': `${clipPosition.y}px`
                }}>
            </div>
            <div className="content-wrapper">
                <div className="login-container">
                    <div className="login-box">

                        <div className="tab-container">
                            <button 
                                className={`tab-button ${activeTab === 'APPLICANT' ? 'active' : ''}`}
                                onClick={(e) => handleTabClick('APPLICANT', e)}
                            >
                                개인회원
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'HR' ? 'active' : ''}`}
                                onClick={(e) => handleTabClick('HR', e)}
                            >
                                기업회원
                            </button>
                        </div>

                        <form onSubmit={handleLogin} className="login-form">
                            <div className="form-group">
                                <label>아이디 (이메일)</label>
                                <input 
                                    type="text" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    placeholder="이메일을 입력하세요"
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>비밀번호</label>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="비밀번호를 입력하세요"
                                    autoComplete='on'
                                    required 
                                />
                            </div>
                            <button type="submit" className="login-button">
                                로그인
                            </button>
                        </form>

                        {error && <p className="error-message">{error}</p>}

                        <div className="signup-section">
                            <p>아직 회원이 아니신가요?</p>
                            <Link to={`/signup?role=${activeTab}`} className="signup-link">
                                회원가입 하기
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;