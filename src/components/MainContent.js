import { useRef, useState } from 'react';

const MainContent = ({ role })=> {
    // if (role === 'HR') return <div>인사담당자 메인 페이지</div>;
    // return <div>취준생 메인 페이지</div>;

    const [fileName, setFileName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef();
    
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            setFileName(file.name);
            setSelectedFile(file);
        } else {
            alert('PDF 파일만 업로드 가능합니다.');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setFileName(file.name);
            setSelectedFile(file);
        } else {
            alert('PDF 파일만 업로드 가능합니다.');
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            alert('PDF 파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

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
            setFileName('');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('업로드 에러:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
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
                                style={{
                                    border: '2px dashed #ccc',
                                    padding: '20px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    marginBottom: '10px'
                                }}
                            >
                                {fileName ? (
                                    <p>{fileName} 선택됨</p>
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
                                disabled={!selectedFile}
                                style={{
                                    opacity: selectedFile ? 1 : 0.5,
                                    cursor: selectedFile ? 'pointer' : 'not-allowed',
                                    padding: '10px 20px',
                                    backgroundColor: selectedFile ? '#007bff' : '#ccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    margin: '10px 0'
                                }}
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
