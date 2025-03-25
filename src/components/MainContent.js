import { useRef, useState } from 'react';

const MainContent = ({ role })=> {
    // if (role === 'HR') return <div>인사담당자 메인 페이지</div>;
    // return <div>취준생 메인 페이지</div>;

    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef();
    
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            setFileName(file.name);
            console.log('업로드된 파일:', file);
            // FormData에 담아 서버로 보내면 됨
        } else {
            alert('PDF 파일만 업로드 가능합니다.');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setFileName(file.name);
            console.log('선택된 파일:', file);
        } else {
            alert('PDF 파일만 업로드 가능합니다.');
        }
    };

    return (
        <main className='l-main'>
            
                <section className="section section-visual"></section>
                <section className="section section-pdf">
                    <div className="inner"> 
                        <div className='btn-wrap'>
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => fileInputRef.current.click()}
                                >
                                {fileName ? (
                                    <p>{fileName} 업로드 완료</p>
                                ) : (
                                    <p>여기로 PDF 파일을 드래그하거나 클릭해서 업로드</p>
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
                            <button type='button'>
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
