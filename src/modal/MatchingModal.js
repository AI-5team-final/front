import { useState } from 'react';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { RiRobot2Line } from 'react-icons/ri';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import fetchClient from '../utils/fetchClient';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useMatch } from '../context/MatchContext';

const MatchingModal = ({isOpen, onRequestClose, setMatchingFiles, setIsMatchingModalOpen,setIsLoadModalOpen, matchingFiles}) => {

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setMatchResults } = useMatch();

    const handleOneToOneMatching = async () => {

        if (!matchingFiles.resume || !matchingFiles.jobPost) {
            toast.error('이력서와 공고 파일 모두 등록해주세요.');
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('resume', matchingFiles.resume);
            formData.append('posting', matchingFiles.jobPost);

            const res = await fetchClient("/pdf/reEpo", {
				method: "POST",
				body: formData,
			});

            if(!res.ok){
                throw new Error("1대1매칭 실패");
            }

            // const data = await res.json();
            const data = [{
                "total_score": 85,
                "summary": "핵심 강점: 8년 경력의 Java/Spring 전문 백엔드 개발자 / 보완점: 특정 결제 시스템 경험 부족 / 종합 의견: 추천",
                "gpt_answer": "총점은 85점으로, 필수 자격요건 충족도 30점, 기술 스택 일치도 20점, 업무 경험 연관성 15점, 직무 적합성 10점, 기업 문화 및 가치관 적합성 10점으로 평가하였습니다."
            }];

            toast.success('매칭 요청 완료!');
            setMatchingFiles({ resume: null, jobPost: null });
            setIsMatchingModalOpen(false);
            console.log(res);
            setMatchResults(res);
            navigate(`/matching`);
        }catch(e){
            console.warn(`${e}: 1대1 매칭 중 에러가 발생했습니다.`);
            toast.error(`1대1 매칭 중 에러가 발생했습니다.`);
        }finally {
            setIsLoading(false);
        }

    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Matching Modal"
            style={{
                overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 11000, },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '12px',
                    zIndex: 11000,
                }
            }}
        >
            <div className='modal modal-match'>
                {
                    isLoading ? (
                        <div className="loading-spinner">
                            <LoadingSpinner/>
                            <p className="loading-spinner__text">
                                    결과를 분석중입니다.<br />잠시만 기다려주세요...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="modal-title">
                                <RiRobot2Line size={24} color="#013A72" />
                                <span>Fit Advisor</span>
                            </div>
                            <div className="modal-subtitle">
                                AI agent "Fit Advisor"는 당신이 가고 싶은 회사에 맞는 로드맵을 만들어줘요
                            </div>
                            <div className="divider" />
                            <p className="resume-list-header">이력서 PDF 업로드</p>
                            <div className="upload-section">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) =>
                                        setMatchingFiles((prev) => ({
                                            ...prev,
                                            resume: e.target.files[0],
                                        }))
                                    }
                                />
                                <button 
                                    className="load-button"
                                    onClick={() => {
                                        setIsLoadModalOpen(true);
                                    }}
                                >
                                    <FaCloudDownloadAlt size={16} />
                                    이력서 불러오기
                                </button>
                            </div>
                            {matchingFiles.resume && (
                                <p className="modal-filename">{matchingFiles.resume.name}</p>
                            )}
                            <div className="divider" />
                            <p className="resume-list-header">공고 PDF 업로드</p>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                    setMatchingFiles((prev) => ({
                                        ...prev,
                                        jobPost: e.target.files[0],
                                    }))
                                }
                            />
                            {matchingFiles.jobPost && (
                                <p className="modal-filename">{matchingFiles.jobPost.name}</p>
                            )}
                            <div className="modal-buttons">
                                <button
                                    className="modal-button cancel-button"
                                    onClick={onRequestClose}
                                >
                                    취소
                                </button>
                                <button
                                    className="modal-button"
                                    onClick={handleOneToOneMatching}
                                >
                                    매칭 요청
                                </button>
                                
                            </div>
                        </>
                    )
                }
                
            </div>
        </Modal>
    );
}

export default MatchingModal;

