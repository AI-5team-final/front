// 로그인 예시
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../layout/Footer';
import useAuth from '../hooks/useAuth';
import '../styles/Login.css';

const Login = () => {
    const { login } = useAuth();
    const [activeTab, setActiveTab] = useState('APPLICANT'); // 기본 개인회원
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(username, password, activeTab);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-container">
            <div className="login-container">
                <div className="login-box">

                    <div className="tab-container">
                        <button 
                            className={`tab-button ${activeTab === 'APPLICANT' ? 'active' : ''}`}
                            onClick={() => setActiveTab('APPLICANT')}
                        >
                            개인회원
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'HR' ? 'active' : ''}`}
                            onClick={() => setActiveTab('HR')}
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
            <Footer />
        </div>
    );
}

export default Login;