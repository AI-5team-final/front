import { toast } from 'react-toastify';
import { reportError } from './reportError';

export const handleClientError = ({
    error,
    toastMessage = '문제가 발생했습니다.',
    report = true,
    contextUrl = window.location.pathname,
}) => {
    // 사용자 알림
    toast.error(toastMessage);

    // 디버깅용 콘솔 로그
    console.error('[CLIENT ERROR]', error);

    // Discord 로깅
    if (report) {
        reportError({
            error,
            url: contextUrl,
        });
    }
};
