// 회원가입 예시
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../layout/Footer';

const SignUp = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const defaultRole = new URLSearchParams(search).get('role') || 'APPLICANT';
    const [activeTab, setActiveTab] = useState(defaultRole);
    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        age: '',
        phone: '',
        companyName: '',
        businessNumber: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, role: activeTab }),
            });

            if (!res.ok) throw new Error('회원가입 실패');

            alert('회원가입 성공! 로그인 해주세요.');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-container">
            <div className="signup-container">
                <div className="signup-box">
                    <h2>회원가입</h2>

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

                    <form onSubmit={handleSignUp} className="signup-form">
                        <div className="form-group">
                            <label>아이디 (이메일)</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={form.email} 
                                onChange={handleChange} 
                                placeholder="이메일을 입력하세요"
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>비밀번호</label>
                            <input 
                                type="password" 
                                name="password" 
                                value={form.password} 
                                onChange={handleChange} 
                                placeholder="비밀번호를 입력하세요"
                                required 
                            />
                        </div>

                        {activeTab === 'APPLICANT' && (
                            <>
                                <div className="form-group">
                                    <label>이름</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={form.name} 
                                        onChange={handleChange} 
                                        placeholder="이름을 입력하세요"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>나이</label>
                                    <input 
                                        type="number" 
                                        name="age" 
                                        value={form.age} 
                                        onChange={handleChange} 
                                        placeholder="나이를 입력하세요"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>전화번호</label>
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        value={form.phone} 
                                        onChange={handleChange} 
                                        placeholder="전화번호를 입력하세요"
                                        required 
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'HR' && (
                            <>
                                <div className="form-group">
                                    <label>회사명</label>
                                    <input 
                                        type="text" 
                                        name="companyName" 
                                        value={form.companyName} 
                                        onChange={handleChange} 
                                        placeholder="회사명을 입력하세요"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>사업자등록번호</label>
                                    <input 
                                        type="text" 
                                        name="businessNumber" 
                                        value={form.businessNumber} 
                                        onChange={handleChange} 
                                        placeholder="사업자등록번호를 입력하세요"
                                        required 
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" className="signup-button">
                            회원가입
                        </button>
                    </form>

                    {error && <p className="error-message">{error}</p>}
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

                .signup-container {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }

                .signup-box {
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

                .signup-form {
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

                .signup-button {
                    background-color: #007bff;
                    color: white;
                    padding: 12px;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    margin-top: 20px;
                }

                .signup-button:hover {
                    background-color: #0056b3;
                }

                .error-message {
                    color: #dc3545;
                    text-align: center;
                    margin-top: 15px;
                }
            `}</style>
        </div>
    );
}

export default SignUp;