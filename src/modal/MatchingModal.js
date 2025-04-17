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

            // const res = await fetchClient("/pdf/reEpo", {
			// 	method: "POST",
			// 	body: formData,
			// });

            // if(!res.ok){
            //     throw new Error("1대1매칭 실패");
            // }

            // const data = await res.json();
            const data = [{
                "total_score": 100,
                "resume_score": 50,
                "selfintro_score": 50,
                "opinion1": "민효준 지원자는 요구하는 기술적 역량과 경험을 모두 충족하고 있습니다.",
                "summary": "민효준 지원자는 프론트엔드 엔지니어로서 뛰어난 경력과 기술적 역량을 보유하고 있으며, 자기소개서에서도 열정과 목표의식을 잘 표현하고 있습니다. 요구사항을 완벽하게 충족시켜 높은 평가를 받았습니다.",
                "eval_resume": "이력서는 매우 훌륭하며, 모든 요구하는 기술 스택에 대해 실무 경험이 있습니다. React, TypeScript, Redux, Styled-components, Webpack 등 다양한 기술을 활용한 경험이 있으며, 협업을 위해 Git을 능숙하게 활용하고 있습니다. 우대사항에 대해서도 UI/UX 설계 관련 경험과 CI/CD 파이프라인 설정 경험을 언급하였으나, 테스트 작성 경험은 기본적인 수준으로 나타났습니다. 그러나 감점 요인은 없고, 이력서 전체적으로 매우 만족스럽습니다.",
                "eval_selfintro": "자기소개서는 논리적이고 성실하게 작성되었습니다. 지원자의 여정, 성격의 장단점, 기술 역량 및 입사 후 목표 등을 명확히 전달하고 있으며, 직무에 대한 이해도와 열정이 느껴집니다. 각 항목이 자소서의 포맷에 맞게 잘 설명되었으며, 표현도 자연스럽습니다. 전반적으로 체계적이고 깊이 있는 내용을 담고 있어 높은 점수를 받을 만합니다.",
                "name": "민효준",
                "uri": "/uploads/file.pdf"
            }];

            toast.success('매칭 요청 완료!');
            setMatchingFiles({ resume: null, jobPost: null });
            setIsMatchingModalOpen(false);    

            setMatchResults(data);
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

