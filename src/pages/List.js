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
                {role === 'HR' && <ListHR data={data} />}
                {role === 'APPLICANT' && <ListApplicant data={data} />}
            </div>
        </main>
    );
}

export default List;