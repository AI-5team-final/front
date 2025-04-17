import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const handleError = (error) => {
    toast.error('파일 업로드 중 오류가 발생했습니다.');
};

export const handleAuthError = (navigate) => {
    toast.error('로그인이 필요한 서비스입니다.');
    localStorage.removeItem('accessToken');
    navigate('/login');
}; 