// 회원가입 예시
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
        <div style={{ maxWidth: '600px', margin: '50px auto' }}>
        <h2>회원가입</h2>

        {/* 탭 */}
        <div>
            <button onClick={() => setActiveTab('APPLICANT')} style={{ marginRight: '10px', backgroundColor: activeTab === 'APPLICANT' ? '#ddd' : '#fff' }}>개인회원</button>
            <button onClick={() => setActiveTab('HR')} style={{ backgroundColor: activeTab === 'HR' ? '#ddd' : '#fff' }}>기업회원</button>
        </div>

        <form onSubmit={handleSignUp} style={{ marginTop: '20px' }}>
            <div>
            <label>아이디 (이메일)</label><br />
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div style={{ marginTop: '10px' }}>
            <label>비밀번호</label><br />
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>

            {/* 개인회원 전용 */}
            {activeTab === 'APPLICANT' && (
            <>
                <div style={{ marginTop: '10px' }}>
                <label>이름</label><br />
                <input type="text" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div style={{ marginTop: '10px' }}>
                <label>나이</label><br />
                <input type="number" name="age" value={form.age} onChange={handleChange} required />
                </div>
                <div style={{ marginTop: '10px' }}>
                <label>전화번호</label><br />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
                </div>
            </>
            )}

            {/* 기업회원 전용 */}
            {activeTab === 'HR' && (
            <>
                <div style={{ marginTop: '10px' }}>
                <label>회사명</label><br />
                <input type="text" name="companyName" value={form.companyName} onChange={handleChange} required />
                </div>
                <div style={{ marginTop: '10px' }}>
                <label>사업자등록번호</label><br />
                <input type="text" name="businessNumber" value={form.businessNumber} onChange={handleChange} required />
                </div>
            </>
            )}

            <button type="submit" style={{ marginTop: '20px' }}>회원가입</button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default SignUp;