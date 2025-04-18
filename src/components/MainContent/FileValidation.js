import { handleNoFileError, handleFileTypeError } from './ErrorHandler';

{/* 파일이 있는지, PDF 파일인지 확인하는 컴포넌트 */}
export const validateFile = (file) => {
    if (!file) {
        handleNoFileError();
        return false;
    }
    if (file.type !== 'application/pdf') {
        handleFileTypeError(file.type);
        return false;
    }
    return true;
}; 