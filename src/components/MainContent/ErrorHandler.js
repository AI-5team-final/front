import { toast } from 'react-toastify';

{/* TODO: ErrorHandler에서 토큰 제외하고 그러는건 월권 행위임. 
    나중에 Auth나 private route에서 처리하는게 좋을듯 
    지금 이 함수를 사용할 때 navigate를 전달해야하는 걸 강제하지도 않고
    밖에서는 그래야 한다는 것도 모름*/}

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

