// 로그인 예시
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../layout/Footer';

const Login = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('APPLICANT'); // 기본 개인회원
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role: activeTab }), // role 같이 넘김
            });

            if (!res.ok) throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');

            const { accessToken } = await res.json();
            localStorage.setItem('accessToken', accessToken);
            navigate('/');
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

            <style jsx>{`
                .page-container {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    background-color: #f5f5f5;
                }

                .login-container {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }

                .login-box {
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 500px;
                }

                h2 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 30px;
                }

                .tab-container {
                    display: flex;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #eee;
                }

                .tab-button {
                    flex: 1;
                    padding: 15px;
                    border: none;
                    background: none;
                    font-size: 16px;
                    cursor: pointer;
                    color: #666;
                    transition: all 0.3s ease;
                }

                .tab-button.active {
                    color: #007bff;
                    border-bottom: 2px solid #007bff;
                    margin-bottom: -2px;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-group label {
                    color: #555;
                    font-weight: 500;
                }

                .form-group input {
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 16px;
                    transition: border-color 0.3s ease;
                }

                .form-group input:focus {
                    border-color: #007bff;
                    outline: none;
                }

                .login-button {
                    background-color: #007bff;
                    color: white;
                    padding: 12px;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                .login-button:hover {
                    background-color: #0056b3;
                }

                .error-message {
                    color: #dc3545;
                    text-align: center;
                    margin-top: 15px;
                }

                .signup-section {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                }

                .signup-section p {
                    color: #666;
                    margin-bottom: 15px;
                }

                .signup-link {
                    display: inline-block;
                    color: #007bff;
                    text-decoration: none;
                    font-weight: 500;
                }

                .signup-link:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}

export default Login;