import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import config from "../config";
import '../styles/SignUp.scss';

const SignUp = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const { search } = useLocation();
    const defaultRole = new URLSearchParams(search).get('role') || 'APPLICANT';
    const [isEmailAvailable, setIsEmailAvailable] = useState(null);
    const [emailCheckMessage, setEmailCheckMessage] = useState('');
    const [activeTab, setActiveTab] = useState(defaultRole);
    const [form, setForm] = useState({
        password: '',
        confirmPassword: '',
        name: '',
        age: '',
        phone: '',
        companyName: '',
        businessNumber: ''
    });
    const [emailId, setEmailId] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailDomain, setEmailDomain] = useState('');
    const [customDomain, setCustomDomain] = useState('');
    const [isCustomDomain, setIsCustomDomain] = useState(false);
    const [error, setError] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(null);
    const [passwordError, setPasswordError] = useState('');
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        setIsEmailAvailable(null); // 이메일 확인 초기화
        setEmailCheckMessage('');  // 메시지도 초기화
    }, [emailId, emailDomain, customDomain]);
    useEffect(() => {
        if (isLoggedIn) navigate('/');
    }, [isLoggedIn]);

    const validateForm = () => {
        const phoneValid = form.phone.length === 13 && !phoneError;
        const passwordValid = form.password === form.confirmPassword && form.password.length > 0;
        const emailValid =
            emailId.length > 0 &&
            (isCustomDomain ? customDomain.length > 0 : emailDomain.length > 0) &&
            isEmailAvailable === true;

        if (activeTab === 'APPLICANT') {
            return phoneValid && passwordValid && emailValid && form.name && form.age;
        } else {
            return passwordValid && emailValid && form.companyName && form.businessNumber;
        }
    };

    useEffect(() => {
        setIsValid(validateForm());
    }, [form, emailId, emailDomain, customDomain, phoneError, activeTab, isEmailAvailable]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (name === 'confirmPassword' || (name === 'password' && form.confirmPassword)) {
            const passwordsMatch = value === (name === 'confirmPassword' ? form.password : form.confirmPassword);
            setPasswordMatch(passwordsMatch);
            setPasswordError(passwordsMatch ? '' : '비밀번호가 일치하지 않습니다.');
        }
    };

    const handlePhoneChange = (e) => {
        const { name, value } = e.target;
        let newValue = value.replace(/[^0-9]/g, '');
        if (newValue.length < 4) {
            newValue = newValue;
        } else if (newValue.length < 8) {
            newValue = `${newValue.slice(0, 3)}-${newValue.slice(3)}`;
        } else {
            newValue = `${newValue.slice(0, 3)}-${newValue.slice(3, 7)}-${newValue.slice(7, 11)}`;
        }

        setForm(prev => ({ ...prev, [name]: newValue }));

        if (newValue.length < 13) {
            setPhoneError('전화번호가 형식에 맞지 않습니다.');
        } else {
            setPhoneError('');
        }
    };
    const handleCheckEmail = async () => {
        const fullEmail = `${emailId}@${isCustomDomain ? customDomain : emailDomain}`.trim();
        console.log(fullEmail);
        if (!fullEmail.includes('@')) {
            setEmailCheckMessage('이메일 형식을 확인해주세요.');
            setIsEmailAvailable(false);
            return;
        }

        try {
            const res = await fetch(`${config.baseURL}/auth/check-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(fullEmail),
            });

            const isAvailable = await res.json();  // 👉 Boolean 값 그대로 받음

            if (isAvailable) {
                setIsEmailAvailable(true);
                setEmailCheckMessage('사용 가능한 이메일입니다.');
            } else {
                setIsEmailAvailable(false);
                setEmailCheckMessage('이미 사용 중인 이메일입니다.');
            }
        } catch (err) {
            console.error(err);
            setIsEmailAvailable(false);
            setEmailCheckMessage('이메일 확인 중 오류가 발생했습니다.');
        }
    };



    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }
        const email = `${emailId.trim()}@${isCustomDomain ? customDomain.trim() : emailDomain}`;

        try {
            const res = await fetch(`${config.baseURL}/auth/signup`, {
                method: 'POST',
                body: JSON.stringify({ ...form, email, role: activeTab }),
                headers: {'Content-Type': 'application/json'},
            });

            if (!res.ok) throw new Error('회원가입 실패');

            alert('회원가입 성공! 로그인 해주세요.');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };
    const domainList = ['gmail.com', 'naver.com', 'daum.net', '직접입력'];
    return (
        <div className="page-container">
            <div className="signup-container">
                <div className="signup-box">
                    <h2>회원가입</h2>

                    <div className="tab-container">
                        <button className={`tab-button ${activeTab === 'APPLICANT' ? 'active' : ''}`} onClick={() => setActiveTab('APPLICANT')}>개인회원</button>
                        <button className={`tab-button ${activeTab === 'HR' ? 'active' : ''}`} onClick={() => setActiveTab('HR')}>기업회원</button>
                    </div>

                    <form onSubmit={handleSignUp} className="signup-form">
                        <div className="form-group" style={{"margin-bottom": emailCheckMessage? "30px": 0}}>
                            <label>아이디 (이메일)</label>
                            <div className="email-input-group">
                                <input
                                    type="text"
                                    name="emailId"
                                    value={emailId}
                                    onChange={(e) => setEmailId(e.target.value)}
                                    placeholder="아이디 입력"
                                    required
                                />
                                <span> @ </span>
                                {!isCustomDomain ? (
                                    <select
                                        className={`domain-select ${emailDomain ? 'has-value' : ''}`}
                                        value={emailDomain}
                                        onChange={(e) => {
                                            const selected = e.target.value;
                                            if (selected === '직접입력') {
                                                setIsCustomDomain(true);
                                                setEmailDomain('');
                                            } else {
                                                setEmailDomain(selected);
                                                setIsCustomDomain(false);
                                            }
                                        }}
                                        required
                                    >
                                        <option value="">도메인 선택</option>
                                        {domainList.map((domain) => (
                                            <option key={domain} value={domain}>{domain}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        name="customDomain"
                                        value={customDomain}
                                        onChange={(e) => setCustomDomain(e.target.value)}
                                        placeholder="직접 입력"
                                        className="domain-select"
                                        required
                                    />
                                )}

                                <div className="check-email-row">
                                    <button
                                        type="button"
                                        onClick={handleCheckEmail}
                                        className="check-email-button"
                                    >
                                        이메일 확인
                                    </button>
                                </div>
                                {emailCheckMessage && (
                                    <p className={isEmailAvailable ? "success-message" : "error-message"}>
                                        {emailCheckMessage}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>비밀번호</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="비밀번호 입력"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>비밀번호 확인</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="비밀번호 재입력"
                                className={passwordMatch === null ? '' : passwordMatch ? 'match' : 'mismatch'}
                                required
                            />
                        </div>
                        {activeTab === 'APPLICANT' && (
                            <>
                                <div className="form-group">
                                    <label>이름</label>
                                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="이름 입력" required />
                                </div>
                                <div className="form-group">
                                    <label>나이</label>
                                    <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="나이 입력" required />
                                </div>
                                <div className="form-group">
                                    <label>전화번호</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handlePhoneChange}
                                        placeholder="전화번호 입력"
                                        maxLength="13"
                                        className={phoneError ? 'error' : ''}
                                        required
                                    />
                                    {phoneError && <p className="error-message">{phoneError}</p>}
                                </div>
                            </>
                        )}

                        {activeTab === 'HR' && (
                            <>
                                <div className="form-group">
                                    <label>회사명</label>
                                    <input type="text" name="companyName" value={form.companyName} onChange={handleChange} placeholder="회사명 입력" required />
                                </div>
                                <div className="form-group">
                                    <label>사업자등록번호</label>
                                    <input type="text" name="businessNumber" value={form.businessNumber} onChange={handleChange} placeholder="사업자등록번호 입력" required />
                                </div>
                            </>
                        )}

                        {error && <p className="error-message">{error}</p>}
                        {passwordError && <p className="error-message">{passwordError}</p>}
                        <button type="submit" className={`signup-button ${isValid ? 'active' : ''}`} disabled={!isValid}>
                            회원가입
                        </button>
                        <button type="button" onClick={() => navigate('/login')} className="back-to-login-button">
                            로그인으로 돌아가기
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;