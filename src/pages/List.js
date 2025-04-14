import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
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
    const { setMatchResults } = useMatch();
    const [loading, setLoading] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const navigate = useNavigate();

    const resumeFileLocal = localStorage.getItem("resumeFileLocal");
 
    useEffect(() => {
        const processEtoC = async () => {
            const { resumeFile } = location.state || {};
  
            if(resumeFile){
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
                    // const data = [
                    //     {
                    //     "title": "피플리",
                    //     "total_score": 95,
                    //     "summary": "핵심 강점: 8년 경력의 Java/Spring 전문 백엔드 개발자로 대용량 트래픽 처리 및 AI 기반 서비스 경험 보유 / 보완점: 특정 기술 스택에서의 경험 부족 / 종합 의견: 추천",
                    //     "gpt_answer": "1. 필수 자격요건 충족도: 30점 (모두 충족) / 2. 기술 스택 일치도: 25점 (주요 기술스택 대부분 일치) / 3. 업무 경험 연관성: 20점 (매우 높은 연관성) / 4. 직무 적합성: 15점 (매우 적합하며 즉시 투입 가능) / 5. 기업 문화 및 가치관 적합성: 5점 (일부 맞음)"
                    //     },
                    //     {
                    //     "title": "크디랩",
                    //     "total_score": 90,
                    //     "summary": "핵심 강점: Java 및 Spring Framework에 대한 깊은 이해와 경험, 대규모 트래픽 처리 및 AI 기반 시스템 설계 경험 / 보완점: 스타트업 경험이 있으나 0에서 1을 만들어본 경험 부족 / 종합 의견: 추천",
                    //     "gpt_answer": "총점 90점은 필수 자격요건 충족도 30점, 기술 스택 일치도 25점, 업무 경험 연관성 20점, 직무 적합성 15점, 기업 문화 및 가치관 적합성 10점으로 구성되었습니다. 지원자는 모든 필수 자격요건을 충족하며, 기술 스택과 업무 경험이 직무와 매우 높은 연관성을 보입니다. 직무 수행 가능 수준이 높고, 기업 문화와 가치관에도 잘 부합합니다."
                    //     },
                    //     {
                    //     "title": "블록체인글로벌 백엔드",
                    //     "total_score": 90,
                    //     "summary": "핵심 강점: 8년 경력의 Java/Spring 전문 백엔드 개발자 / 보완점: 블록체인 경험 부족 / 종합 의견: 추천",
                    //     "gpt_answer": "필수 자격요건 충족도: 30점 (모두 충족) / 기술 스택 일치도: 25점 (주요 기술스택 대부분 일치) / 업무 경험 연관성: 20점 (매우 높은 연관성) / 직무 적합성: 15점 (매우 적합하며 즉시 투입 가능) / 기업 문화 및 가치관 적합성: 10점 (가치관/문화 완벽히 부합)"
                    //     },
                    //     {
                    //     "title": "엔코위더스",
                    //     "total_score": 85,
                    //     "summary": "핵심 강점: 8년의 백엔드 개발 경험과 팀 리딩 경험 / 보완점: Node.js 경험 부족 / 종합 의견: 추천",
                    //     "gpt_answer": "필수 자격요건 충족도: 30점 (모두 충족) / 기술 스택 일치도: 20점 (절반 이상 일치) / 업무 경험 연관성: 20점 (매우 높은 연관성) / 직무 적합성: 15점 (매우 적합) / 기업 문화 및 가치관 적합성: 0점 (맞지 않음)"
                    //     },
                    //     {
                    //     "title": "서플라이스",
                    //     "total_score": 80,
                    //     "summary": "핵심 강점: 백엔드 개발 경험이 풍부하고 CI/CD 및 클라우드 인프라 설계 경험 보유 / 보완점: TypeScript 경험 부족 / 종합 의견: 추천",
                    //     "gpt_answer": "총점 80점은 다음과 같은 기준으로 산정되었습니다. 필수 자격요건 충족도에서 20점, 기술 스택 일치도에서 20점, 업무 경험 연관성에서 15점, 직무 적합성에서 10점, 기업 문화 및 가치관 적합성에서 5점을 부여하였습니다."
                    //     }
                    // ];
                    
                    setMatchResults(data);
                    setTimeout(() => setShowContent(true), 100);
                } catch (error) {
                    console.error('EtoC 처리 중 오류:', error);
                } finally {
                    setLoading(false);
                }
            }
            
        };

        processEtoC();
    }, [navigate]);

    if (!resumeFileLocal) {
        console.warn("이력서 파일이 없습니다.");
        return <Navigate to="/"/>;
    }
    

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
                {role === 'APPLICANT' && <ListApplicant />}
            </div>
        </main>
    );
};

export default List;