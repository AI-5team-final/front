import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // ✅ 추가
import '../styles/SignUp.css';
import fetchClient from '../utils/fetchClient';

const SignUp = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth(); // ✅ 로그인 여부 확인
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

    // ✅ 로그인 상태면 회원가입 페이지 접근 시 홈으로 이동
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        console.log(form);

        try {
            const res = await fetchClient('/auth/signup', {
                method: 'POST',
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
                        <button 
                            type="button" 
                            onClick={() => navigate('/login')} 
                            className="back-to-login-button"
                        >
                            로그인으로 돌아가기
                        </button>
                    </form>

                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default SignUp;