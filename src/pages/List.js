import { useState, useEffect } from 'react';
import ListApplicant from '../components/ListApplicant';
import ListHR from '../components/ListHR';
import useToken from '../hooks/useToken';
import { useLocation } from 'react-router-dom';
import fetchClient from '../utils/fetchClient';
import { useMatch } from '../context/MatchContext';

const List = () => {
    const { role } = useToken();
    const location = useLocation();
    const { matchResults, setMatchResults } = useMatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const processEtoC = async () => {
            const { resumeFile } = location.state || {};
            
            // 이미 결과가 있고 새로운 파일이 없는 경우 재연산 방지
            if (!resumeFile && matchResults.length > 0) {
                return;
            }

            if (!resumeFile) {
                console.log('이력서 파일이 없습니다.');
                return;
            }

            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('file', resumeFile);

                const response = await fetchClient('/pdf/EtoC', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('EtoC 처리 실패');
                }

                const data = await response.json();
                setMatchResults(data);
            } catch (error) {
                console.error('EtoC 처리 중 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        processEtoC();
    }, [location.state, matchResults.length, setMatchResults]);

    return (
        <main className="l-list">
            <div className='inner'>
                {loading ? (
                    <div>처리 중...</div>
                ) : (
                    <>
                        {role === 'HR' && <ListHR />}
                        {role === 'APPLICANT' && <ListApplicant matchResults={matchResults} />}
                    </>
                )}
            </div>
        </main>
    );
}

export default List;