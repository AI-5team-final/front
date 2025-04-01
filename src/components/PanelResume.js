import React, { useRef, useState } from 'react';
import { FaCloudArrowUp } from "react-icons/fa6";
import { GrDocumentPdf } from 'react-icons/gr';
import { useEffect } from 'react';
import '../styles/fonts.css';
import useToken from '../hooks/useToken';
import { useNavigate } from 'react-router-dom';

const styles = {
  heroSection: {
    width: '100%',
    backgroundColor: '#9fd3fd',
    padding: '0',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '60px',
    height: '350px'
  },
  heroImageContainer: {
    width: '80%',
    maxWidth: '900px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: '0 30px'
  },
  heroText: {
    flex: '1',
    paddingRight: '20px'
  },
  heroImg: {
    height: '100%',
    width: 'auto',
    objectFit: 'contain'
  },
  title: {
    fontSize: '2.5rem',
    color: '#013A72',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: '1.0rem',
    marginTop: '10px',
    color: '#013A72',
  },
  container: {
    fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
    padding: '40px 20px 20px',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  uploadCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    padding: '40px 20px',
    marginBottom: '40px',
    width: '80%',
    maxWidth: '900px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px'
  },
  uploadArea: {
    border: '2px dashed #ccc',
    borderRadius: '12px',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#f8f9fa',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    width: '100%'
  },
  uploadTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '10px'
  },
  uploadParagraph: {
    color: '#555',
    fontSize: '0.95rem'
  },
  uploadNote: {
    fontSize: '0.75rem',
    color: '#999'
  },
  icon: {
    fontSize: '40px',
    color: '#013A72'
  },
  resumeList: {
    borderTop: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
    padding: '0',
    width: '80%',
    maxWidth: '900px'
  },
  resumeItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 0',
    borderBottom: '1px solid #ddd',
    alignItems: 'center'
  },
  resumeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  resumeName: {
    fontWeight: '600',
    fontSize: '0.95rem',
    color: '#111827',
  },
  resumeDate: {
    fontSize: '0.8rem',
    color: '#9CA3AF',
  },
  deleteButton: {
    border: '1px solid #ccc',
    borderRadius: '6px',
    padding: '5px 10px',
    cursor: 'pointer',
    backgroundColor: '#ffffff',
    transition: 'background-color 0.2s'
  },
  deleteButtonHover: {
    backgroundColor: '#f0f0f0'
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    textAlign: 'center',
    minWidth: '300px',
  },
  modalFileName: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#013A72',
    margin: '15px 0',
    wordBreak: 'break-all'
  },
  modalButtons: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
    justifyContent: 'center'
  }
};

const PanelResume = () => {
    const [resumes, setResumes] = useState([]);
    const [fileState, setFileState] = useState({ name: '', file: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef();
    const { token, removeToken } = useToken();
    const navigate = useNavigate();

    const handleAuthError = () => {
        alert('로그인이 필요합니다.');
        removeToken();
        navigate('/login');
    };

    const handleError = (error) => {
        console.error('에러 발생:', error);
        if (error instanceof Error) {
            alert(error.message);
        } else if (typeof error === 'object') {
            alert(JSON.stringify(error, null, 2));
        } else {
            alert(String(error));
        }
    };

    const validateFile = (file) => {
      if (!file) return false;
      if (file.type !== 'application/pdf') {
        alert('PDF 파일만 업로드 가능합니다.');
        return false;
      }
      return true;
    };
  
    const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setFileState({ name: file.name, file });
        setIsModalOpen(true);
      }
    };
  
    const handleConfirmUpload = async () => {
      if (!fileState.file) {
        alert('PDF 파일을 선택해주세요.');
        return;
      }

      if (!token) {
        handleAuthError();
        return;
      }

      const formData = new FormData();
      formData.append('file', fileState.file);

      try {
        const response = await fetch('/pdf/upload', {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          handleAuthError();
          return;
        }

        const responseText = await response.text();
        let errorMessage;
        
        try {
          const responseData = JSON.parse(responseText);
          errorMessage = responseData.message || responseText;
        } catch {
          errorMessage = responseText;
        }

        if (!response.ok) {
          switch (response.status) {
            case 400:
              throw new Error(`파일 업로드 실패: ${errorMessage}`);
            case 403:
              throw new Error('접근 권한이 없습니다.');
            case 413:
              throw new Error('파일 크기가 너무 큽니다.');
            case 415:
              throw new Error('지원하지 않는 파일 형식입니다.');
            case 500:
              throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            default:
              throw new Error(`업로드 실패: ${errorMessage}`);
          }
        }

        console.log('업로드 성공:', errorMessage);
        alert('이력서가 성공적으로 업로드되었습니다.');

        setFileState({ name: '', file: null });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setIsModalOpen(false);

        fetchResumes();
      } catch (error) {
        handleError(error);
      }
    };
  
    const handleDeleteRequest = (resume) => {
      setDeleteTarget(resume);
    };
  
    const handleConfirmDelete = async () => {
        if (!token) {
          handleAuthError();
          return;
        }

        try {
          const response = await fetch(`/pdf/delete/${deleteTarget.id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.status === 401) {
            handleAuthError();
            return;
          }

          if (!response.ok) {
            throw new Error('삭제 실패');
          }
      
          setResumes(prev => prev.filter(r => r.id !== deleteTarget.id));
          setDeleteTarget(null);
        } catch (error) {
          handleError(error);
        }
    };

    const fetchResumes = async () => {
      if (!token) {
        handleAuthError();
        return;
      }

      try {
          setIsLoading(true);
          const res = await fetch('/pdf/list', {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });

          if (res.status === 401) {
            handleAuthError();
            return;
          }

          if (res.status === 403) {
            alert('접근 권한이 없습니다.');
            return;
          }

          if (!res.ok) {
              throw new Error('서버 응답 에러');
          }

          const data = await res.json();
          setResumes(Array.isArray(data) ? data : []);
      } catch (err) {
          handleError(err);
          setResumes([]);
      } finally {
          setIsLoading(false);
      }
    };

    useEffect(() => {
        if (token) {
            fetchResumes();
        }
    }, [token]);
    
    return (
        <>
          <section style={styles.heroSection}>
            <div style={styles.heroImageContainer}>
              <div style={styles.heroText}>
                <h1 style={styles.title}>이력서 관리</h1>
                <p style={styles.subtitle}>나의 이력서를 한눈에 관리하고, 더 나은 기회를 준비하세요.</p>
              </div>
              <img
                src="/images/Applicant_Resume.png"
                alt="이력서 등록하기"
                style={styles.heroImg}
              />
            </div>
          </section>
    
          <div style={styles.container}>
            <div style={styles.uploadCard}>
              <div
                style={styles.uploadArea}
                onClick={() => fileInputRef.current.click()}
              >
                <FaCloudArrowUp style={styles.icon} />
                <h2 style={styles.uploadTitle}>이력서 등록하기</h2>
                <p style={styles.uploadParagraph}>PDF 형식의 이력서를 등록할 수 있습니다.</p>
                <p style={styles.uploadParagraph}>원하지 않는 이력서는 언제든 삭제할 수 있어요.</p>
                <p style={styles.uploadNote}>*이미지는 인식되지 않을 수 있습니다.</p>
                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
    
            <div style={styles.resumeList}>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  이력서 목록을 불러오는 중...
                </div>
              ) : !Array.isArray(resumes) || resumes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  등록된 이력서가 없습니다.
                </div>
              ) : (
                resumes.map((resume) => (
                  <div key={resume.id} style={styles.resumeItem}>
                    <div style={styles.resumeInfo}>
                      <GrDocumentPdf size={40} color="#6B7280" />
                      <div style={{ marginLeft: '10px' }}>
                        <a style={styles.resumeLink} onClick={() => alert(`'${resume.name}' 다운로드 기능은 추후 제공됩니다.`)}>
                          {resume.name}
                        </a>
                        <p style={styles.resumeDate}>등록일: {resume.date}</p>
                      </div>
                    </div>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDeleteRequest(resume)}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.deleteButtonHover.backgroundColor}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      삭제하기
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
    
          {isModalOpen && (
            <div style={styles.modalBackdrop}>
              <div style={styles.modal}>
                <p>이 이력서를 업로드하시겠습니까?</p>
                <p style={styles.modalFileName}>{fileState.name}</p>
                <div style={styles.modalButtons}>
                  <button onClick={handleConfirmUpload}>확인</button>
                  <button onClick={() => setIsModalOpen(false)}>취소</button>
                </div>
              </div>
            </div>
          )}
    
          {deleteTarget && (
            <div style={styles.modalBackdrop}>
              <div style={styles.modal}>
                <p>정말 이 이력서를 삭제하시겠습니까?</p>
                <p style={styles.modalFileName}>{deleteTarget.name}</p>
                <div style={styles.modalButtons}>
                  <button onClick={handleConfirmDelete}>삭제</button>
                  <button onClick={() => setDeleteTarget(null)}>취소</button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    };

export default PanelResume;
