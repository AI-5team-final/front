import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListApplicant from '../components/ListApplicant';
import ListHR from '../components/ListHR';
import useToken from '../hooks/useToken';

const List = () => {
    const navigate = useNavigate();
    const { role } = useToken();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Current role:', role); 
        if (!role) {
            navigate('/login'); // 역할이 없으면 로그인 페이지로 리다이렉트
            return;
        }

        const fetchData = async () => {
            try {
                // 더미 데이터 주석 처리
                // const dummyData = role === 'HR' 
                //     ? [{ id: 1, name: 'HR User 1' }, { id: 2, name: 'HR User 2' }]
                //     : [{ id: 1, name: 'Applicant 1' }, { id: 2, name: 'Applicant 2' }];

                // 실제 API 호출 대신 더미 데이터 설정
                // setData(dummyData);

                // 실제 API 호출 예시 (주석 처리)
                // const response = await fetch(role === 'HR' ? '/api/hr-list' : '/api/applicant-list');
                // if (!response.ok) {
                //     throw new Error('데이터를 가져오는 데 실패했습니다.');
                // }
                // const result = await response.json();
                // setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [role, navigate]);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;

    return (
        <main className="l-list">
            <div className='inner'>
                <h1>리스트 페이지</h1>
                {role === 'HR' && <ListHR data={data} />}
                {role === 'APPLICANT' && <ListApplicant data={data} />}
            </div>
        </main>
    );
}

export default List;