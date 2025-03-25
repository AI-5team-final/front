// 로그인 예시
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        <div style={{ maxWidth: '500px', margin: '50px auto' }}>
            <h2>로그인</h2>

            {/* 탭 선택 */}
            <div>
                <button onClick={() => setActiveTab('APPLICANT')} style={{ marginRight: '10px', backgroundColor: activeTab === 'APPLICANT' ? '#ddd' : '#fff' }}>개인회원</button>
                <button onClick={() => setActiveTab('HR')} style={{ backgroundColor: activeTab === 'HR' ? '#ddd' : '#fff' }}>기업회원</button>
            </div>

            <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
                <div>
                <label>아이디 (이메일)</label><br />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div style={{ marginTop: '10px' }}>
                <label>비밀번호</label><br />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" style={{ marginTop: '20px' }}>로그인</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* 회원가입 이동 */}
            <div style={{ marginTop: '20px' }}>
                <p>아직 회원이 아니신가요?</p>
                {/* 회원가입으로 role 정보 전달 */}
                <Link to={`/signup?role=${activeTab}`}>
                    <button>회원가입 하기</button>
                </Link>
            </div>
        </div>
    );
}


export default Login;