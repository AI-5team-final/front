import { useRef, useState } from 'react';

const styles = {
    uploadArea: {
        border: '2px dashed #ccc',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        marginBottom: '10px'
    },
    button: (isSelected) => ({
        opacity: isSelected ? 1 : 0.5,
        cursor: isSelected ? 'pointer' : 'not-allowed',
        padding: '10px 20px',
        backgroundColor: isSelected ? '#007bff' : '#ccc',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        margin: '10px 0'
    })
};

const MainContent = ({ role })=> {
    // if (role === 'HR') return <div>인사담당자 메인 페이지</div>;
    // return <div>취준생 메인 페이지</div>;

    const [fileState, setFileState] = useState({
        name: '',
        file: null
    });
    const fileInputRef = useRef();
    
    const validateFile = (file) => {
        if (!file) return false;
        if (file.type !== 'application/pdf') {
            alert('PDF 파일만 업로드 가능합니다.');
            return false;
        }
        return true;
    };

    const handleError = (error) => {
        console.error('업로드 에러:', error);
        alert('파일 업로드 중 오류가 발생했습니다.');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (validateFile(file)) {
            setFileState({
                name: file.name,
                file: file
            });
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (validateFile(file)) {
            setFileState({
                name: file.name,
                file: file
            });
        }
    };

    const handleSubmit = async () => {
        if (!fileState.file) {
            alert('PDF 파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileState.file);

        try {
            // TODO: API 엔드포인트로 변경 필요
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('업로드 실패');
            }

            const result = await response.json();
            console.log('업로드 성공:', result);
            alert('파일이 성공적으로 업로드되었습니다.');
            
            // 업로드 성공 후 상태 초기화
            setFileState({ name: '', file: null });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <main className='l-main'>
            
                <section className="section section-visual"></section>
                <section className="section section-pdf">
                    <div className="inner"> 
                        <div className='btn-wrap'>
                            <div
                                className="upload-area"
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => fileInputRef.current.click()}
                                style={styles.uploadArea}
                            >
                                {fileState.name ? (
                                    <p>{fileState.name} 선택됨</p>
                                ) : (
                                    <p>여기로 PDF 파일을 드래그하거나 클릭해서 선택</p>
                                )}
                                {/* 숨겨진 input */}
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            <button 
                                type='button'
                                onClick={handleSubmit}
                                disabled={!fileState.file}
                                style={styles.button(!!fileState.file)}
                            >
                                <span>Import<br/>File</span>
                            </button>
                            <p>*등록가능한 파일 형식 및 확장자: PDF</p>
                        </div>
                        <div className="txt-wrap">
                            텍스트영역
                        </div>
                    </div>
                </section>
                
            
        </main>
    );
} 

export default MainContent;
