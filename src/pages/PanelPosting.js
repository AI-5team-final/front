import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCloudArrowUp } from "react-icons/fa6";
import { GrDocumentPdf } from 'react-icons/gr';
import { toast } from 'react-toastify';
import { IoMdRefresh } from 'react-icons/io';
import { BsChevronRight } from 'react-icons/bs';
import fetchClient from '../utils/fetchClient';
import UploadCheckModal from '../modal/UploadCheckModal';
import DeleteModal from '../modal/DeleteModal';
import LoadingSpinner from '../components/LoadingSpinner';
import UploadCheckPostingModal from '../modal/UploadCheckPostingModal';
import useAuth from '../hooks/useAuth';

const PanelPosting = () => {
    const [postings, setPostings] = useState([]);
    const [fileState, setFileState] = useState({ name: '', file: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const { userInfo } = useAuth();
    const role = userInfo?.role;
    const fileInputRef = useRef();
    const startDateInputRef = useRef();
    const endDateInputRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPostings();
    }, []);

    const handleError = (error) => {
        console.error('에러 발생:', error);
        if (error instanceof Error) {
            toast.error(error.message);
        } else if (typeof error === 'object') {
            toast.error(JSON.stringify(error, null, 2));
        } else {
            toast.error(String(error));
        }
    };

    const validateFile = (file) => {
        if (!file) return false;
        if (file.type !== 'application/pdf') {
            toast.error('PDF 파일만 업로드 가능합니다.');
            return false;
        }
        return true;
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (validateFile(file)) {
            setFileState({ name: file.name, file });
            // setIsModalOpen(true);
        }
    };


    const handleConfirmUpload = async () => {
        if (!fileState.file) {
            toast.error('PDF 파일을 선택해주세요.');
            return;
        }


        const formData = new FormData();
        formData.append('file', fileState.file);
        formData.append('startDay', startDate);
        formData.append('endDay', endDate);
        setIsLoading(true);
        setIsModalOpen(false);

        try {
            const response = await fetchClient('/pdf/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '파일 업로드에 실패했습니다.');
            }
            
            toast.success('공고가 성공적으로 업로드되었습니다.');
            setFileState({ name: '', file: null });
            setStartDate(null);
            setEndDate(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            if(startDateInputRef.current) startDateInputRef.current.value = "";
            if(endDateInputRef.current) endDateInputRef.current.value = "";
            fetchPostings();
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false)
        }
    };

    
    
    const handleDeleteRequest = (posting) => {
        setDeleteTarget(posting);
    };

    const handleConfirmDelete = async () => {

        setDeleteTarget(null);

        try {
            const response = await fetchClient('/pdf/delete', {
                method: 'POST',
                body: JSON.stringify({ pdfId: deleteTarget.id })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '삭제에 실패했습니다.');
            }
            
            setPostings(prev => prev.filter(r => r.id !== deleteTarget.id));
            toast.success('공고가 삭제되었습니다.');
            
        } catch (error) {
            handleError(error);
        }
    };

    const handleChecked = () => {
        if(startDateInputRef.current) startDateInputRef.current.value = ""
        if(endDateInputRef.current) endDateInputRef.current.value = ""
        
        setIsChecked(prev=>!prev);
        const today = new Date();
        const year = today.getFullYear();
        const addOneYear = year+1;
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const day = ('0' + today.getDate()).slice(-2);
        const dateString = year + '-' + month  + '-' + day;
        const dateString2 = addOneYear + '-' + month  + '-' + day;
        setStartDate(dateString);
        setEndDate(dateString2);
    }

    const fetchPostings = async () => {

        try {
            setIsLoading(true);
            const response = await fetchClient('/pdf/list');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '채용공고 목록을 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            setPostings(Array.isArray(data.pdfs) ? data.pdfs : []);
        } catch (error) {
            handleError(error);
            setPostings([]);
        } finally {
            setIsLoading(false);
        }
    };

    const allSelected = () => {
        if (isChecked) {
            return !!fileState.file;
        }
        return !!(startDate && endDate && fileState.file);
    }

    const selectedOne = () => {
        if(startDate || endDate || fileState.file || isChecked){
            return true;
        }else {
            return false;
        }
    }
    
    const handleReset = () => {
        console.log("초기화")
    
        if(startDateInputRef.current) startDateInputRef.current.value = ""
        if(endDateInputRef.current) endDateInputRef.current.value = ""
        
        setIsChecked(false);
        setStartDate(null);
        setEndDate(null);
        setFileState({ name: '', file: null });
    }
    

    


    const closeUploadModal = () => setIsModalOpen(prev=>!prev);
    const closeDeleteModal = () => setDeleteTarget(null);
    


    return (
        <main className="l-panel l-panel-postings">
            <section className="hero-section">
                <div className="inner">
                    <div className="hero-text">
                        <h2 className="title">채용공고 관리</h2>
                        <p className="subtitle">채용공고를 한눈에 관리하고, 더 나은 인재 채용을 준비하세요.</p>
                    </div>
                    <img
                        src="/images/HR_Posting.png"
                        alt="채용공고 등록하기"
                        className="hero-img"
                    />
                </div>
            </section>

            <section className="section section-upload">
                <div className="inner">
                    <h2>채용공고 등록하기</h2>
                    <div className="register-wrap">    
                        <div className='date-area'>
                            <div>
                                <h3>STEP1</h3>
                                <h4>공고기간 설정</h4>
                                <p>공고의 시작일과 마감일을 선택해주세요.<br/>
                                선택한 기간 동안만 지원자가 공고를 확인할 수 있습니다.</p>
                                <small>*상시채용은 등록일로부터 1년간 공고가 유지됩니다.</small>
                            </div>
                            <div>
                                <div className='checkbox-wrap'>
                                    <input type="checkbox" name="checkbox" id="checkbox" checked={isChecked} onChange={handleChecked}/>
                                    <label htmlFor="checkbox">상시채용</label>
                                </div>
                                <div className='date-wrap-box'>
                                    <div className={`date-wrap ${isChecked ? "disabled": ""}`}>
                                        <p>시작일</p>
                                        <input type="date" name="startDate" id="startDate" onChange={(e) => {
                                            const newStart = e.target.value;
                                            if (endDate && endDate < newStart){
                                                setEndDate('')
                                                endDateInputRef.current.value = "";
                                            } 
                                            setStartDate(newStart);
                                            startDateInputRef.current.value = newStart;
                                        }} ref={startDateInputRef} 
                                        required/>
                                    </div>
                                    <div className={`date-wrap ${isChecked ? "disabled": ""}`}>
                                        <p>마감일</p>
                                        <input type="date" name="endDate" id="endDate" onChange={(e)=>{
                                            setEndDate(e.target.value)}} ref={endDateInputRef} min={startDate || undefined} required/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='card-area'>
                            <h3><BsChevronRight /> STEP2</h3>
                            <div className="upload-card">
                                <div 
                                    className="upload-area"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {fileState.name ? (
                                        <>
                                            <h5>{fileState.name}</h5>
                                            <p className="upload-note">*다른 PDF를 선택하려면 다시 클릭하세요.</p>
                                        </>
                                    ) : (
                                        <>
                                         <FaCloudArrowUp className="icon" />
                                        {/* <h4 className="upload-title">PDF 등록하기</h4> */}
                                        
                                        <p className="upload-paragraph">PDF 파일로 채용공고를 등록해보세요.  </p>
                                        <p className="upload-paragraph">공고는 등록 후 언제든 삭제할 수 있어요.</p>
                                        <p className="upload-note">*PDF 형식만 업로드 가능하며, 이미지 파일은 인식되지 않습니다.</p>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        name="fileUpload"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='btn-wrap'>
                        <button type="button" className={`btn-reset ${selectedOne() ? "" : "disabled"}`} onClick={handleReset}><IoMdRefresh /> 초기화</button>
                        <button type="button" className={`btn-register ${allSelected() ? "" : "disabled"}`} onClick={()=>setIsModalOpen(true)}>등록하기</button>
                    </div>
                </div>
            </section>
            <section className="section section-list">
                <div className='inner'>
                    <h2>내 공고목록</h2>
                    <div className="list">
                        {isLoading ? (
                            <div style={{padding: "20px 0", borderBottom: "1px solid #e0e0e0"}}>
                                <LoadingSpinner/>
                                <div className="loading">
                                    공고 목록을 불러오는 중...
                                </div>
                            </div>
                        ) : !Array.isArray(postings) || postings.length === 0 ? ( 
                            <div className="empty-state">
                                등록된 공고가 없습니다.
                            </div>
                        ) : (
                            postings.map((posting) => (
                                <div key={posting.id} className="item">
                                    <div className="info">
                                        <GrDocumentPdf size={40} color="#6B7280" />
                                        <div>
                                            <a
                                                className="link"
                                                href={posting.presignedUrl}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {posting.pdfFileName}
                                            </a>
                                            <p className="date">
                                                등록일: {new Date(posting.uploadedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteRequest(posting)}
                                    >
                                        삭제하기
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* 공고 업로드 확인 모달 */}
            <UploadCheckPostingModal isOpen={isModalOpen} onRequestClose={closeUploadModal} fileState={fileState} handleSubmit={handleConfirmUpload} startDate={startDate} endDate={endDate} />

            {/* 삭제 모달 */}
            <DeleteModal isOpen={deleteTarget} onRequestClose={closeDeleteModal} deleteTarget={deleteTarget} handleConfirmDelete={handleConfirmDelete} />
        </main>
    );
};

export default PanelPosting;
