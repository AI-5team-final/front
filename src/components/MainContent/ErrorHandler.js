import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

{/* TODO: ErrorHandler에서 토큰 제외하고 그러는건 월권 행위임. 
    나중에 Auth나 private route에서 처리하는게 좋을듯 
    지금 이 함수를 사용할 때 navigate를 전달해야하는 걸 강제하지도 않고
    밖에서는 그래야 한다는 것도 모름*/}
export const handleAuthError = (error = null, navigate) => {
    if (error) {
        console.error('handleAuthError :', error);
    }
    toast.error('로그인이 필요한 서비스입니다.');
    localStorage.removeItem('accessToken');
    navigate('/login');
};

export const handleFileUploadError = (error = null)  => {
    if (error) {
        console.error('handleFileUploadError :', error);
    }
    toast.error('업로드 중 오류가 발생했습니다.');
};

export const handleNoFileError = (error = null) => {
    if (error) {
        console.error('handleNoFileError :', error);
    }
    toast.error('파일이 없습니다.');
};

export const handleFileTypeError = (error = null) => {
    if (error) {
        console.error('handleFileTypeError :', error);
    }
    toast.error(`PDF 파일만 업로드 가능합니다.`);
}; 

export const handleFileNotSelectedError = (fileType, error = null) => {
    if (error) {
        console.error('handleFileNotSelectedError :', error);
    }
    toast.error(`${fileType}가 선택되지 않았습니다.`);
};

export const handleFileLoadError = (error = null) => {
    if (error) {
        console.error('handleFileLoadError :', error);
    }
    toast.error('파일을 불러오는 중 오류가 발생했습니다.');
};

export const handleListLoadingError = (error = null) => {
    if (error) {
        console.error('handleListLoadError :', error);
    }
    toast.error('목록 로드 중 오류가 발생했습니다.');
};

export const handleApiResponseError = (errorMessage) => {
    toast.error(errorMessage);
};

{/* TODO: 에러 처리하는 페이지랑 연결하기.
    마찬가지로 여기서도 navigate 를 안 쓰는 쪽으로 해야 해 */}
export const handleNetworkError = (error, navigate) => {
    console.error('Network Error:', error);
    navigate('/error', { 
        state: { 
            error: '네트워크 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
            errorDetails: error.message 
        } 
    });
};

