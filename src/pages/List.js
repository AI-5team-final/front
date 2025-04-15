import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';
import ListApplicant from '../components/ListApplicant';
import ListHR from '../components/ListHR';
import LoadingSpinner from '../components/LoadingSpinner';
import fetchClient from '../utils/fetchClient';
import useToken from '../hooks/useToken';
import '../styles/List.scss';
import '../styles/ListCommon.scss';
import '../styles/LoadingSpinner.scss';

const List = () => {
    const { role } = useToken();
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(false);
    const { resumeFile, jobPostFile, setMatchResults, matchResults } = useMatch();
    

    useEffect(() => {
        const fetchMatches = async () => {
            if (!role) return;

            const file = role === 'APPLICANT' ? resumeFile : jobPostFile;
            if (!file) return;

            // 이미 매칭 결과가 있으면 fetch 생략
            if (matchResults?.length > 0) {
                setReady(true);
                return;
            }

            setLoading(true);
            console.log("로딩");
            
            try {
                const formData = new FormData();
                formData.append('file', file);

                const endpoint = role === 'APPLICANT' ? '/pdf/EtoC' : '/pdf/CtoE';
                const response = await fetchClient(endpoint, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('매칭 요청 실패');

                const data = await response.json();
                console.log("data", data);
                setMatchResults(data);
                setReady(true);
                console.log("준비됨")
            } catch (err) {
                console.error(`${role} 요청 실패:`, err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [resumeFile, jobPostFile, role]);


    if (!role) return null;

    const isResumeUploaded = localStorage.getItem('resumeUploaded') === 'true';
    const isJobPostUploaded = localStorage.getItem('jobPostUploaded') === 'true';

    if (
        (role === 'APPLICANT' && !resumeFile && !isResumeUploaded) ||
        (role === 'HR' && !jobPostFile && !isJobPostUploaded)
    ) {
        return <Navigate to="/" />;
    }
    

    return (
        <main className={`l-list ${loading ? "loading": ""}`}>
            {loading && (
                <div className="slider-transition">
                    <div className="loading-spinner">
                        <LoadingSpinner />
                        <p className="loading-spinner__text">
                            {role === 'APPLICANT'
                                ? '이력서를 분석 중입니다'
                                : '공고와 이력서를 매칭 중입니다'}
                            <br />잠시만 기다려주세요...
                        </p>
                    </div>
                </div>
            )}
            {!loading && ready && role === 'APPLICANT' && <ListApplicant />}
            {!loading && ready && role === 'HR' && <ListHR />}
        </main>
    );
};

export default List;