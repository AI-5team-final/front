import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';
import ListApplicant from '../components/ListApplicant';
import ListHR from '../components/ListHR';
import LoadingSpinner from '../components/LoadingSpinner';
import fetchClient from '../utils/fetchClient';
import useToken from '../hooks/useToken';
import '../styles/List.scss';
import '../styles/SliderTransition.scss';
import '../styles/LoadingSpinner.scss';

const List = () => {
    const location = useLocation();
    const { role } = useToken();
    const { matchResults, setMatchResults } = useMatch();
    const [loading, setLoading] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const navigate = useNavigate();
    

    useEffect(() => {
        const processEtoC = async () => {
            const { resumeFile } = location.state || {};

            if (!resumeFile) {
                console.warn("resumeFile이 없음 → /로 이동");
                navigate("/");
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
                setTimeout(() => setShowContent(true), 100);
            } catch (error) {
                console.error('EtoC 처리 중 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        processEtoC();
    }, [location.state, matchResults.length, setMatchResults]);



    if (loading) {
        return (
            <main className="l-list loading">
                <div className="slider-transition">
                    <div className="loading-spinner">
                        <LoadingSpinner />
                        <p className="loading-spinner__text">
                            이력서를 분석하고 있습니다.<br />잠시만 기다려주세요...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="l-list">
            <div className={`content-container ${showContent ? 'show' : ''}`}>
                {role === 'HR' && <ListHR />}
                {role === 'APPLICANT' && <ListApplicant matchResults={matchResults} />}
            </div>
        </main>
    );
};

export default List;