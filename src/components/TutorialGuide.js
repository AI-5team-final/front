import { useEffect } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import '../styles/TutorialGuide.scss';

// 각 페이지별 튜토리얼 스텝 정의
const tutorialStepsMap = {
    applicant: [
        {
            element: '.hero-content',
            intro: '안녕하세요! AI 매칭 서비스 Rezoom에 오신 것을 환영합니다.',
            position: 'bottom'
        },
        {
            element: '.upload-area',
            intro: '구직자 여러분이 가진 이력서(PDF)를 업로드하여 지금 바로 매칭을 시작할 수 있습니다.',
            position: 'bottom'
        },
        {
            element: '.button:nth-of-type(1)',
            intro: '이전에 업로드한 이력서를 불러올 수 있습니다.',
            position: 'bottom'
        },
        {
            element: '.button:nth-of-type(2)',
            intro: 'Fit Advisor와 1:1 매칭을 진행할 수 있습니다.',
            position: 'bottom'
        }
    ]
    // 다른 페이지의 튜토리얼 스텝도 여기에 추가 가능
};

const TutorialGuide = ({ page, customSteps, options = {} }) => {
    useEffect(() => {
        const intro = introJs();
        
        const defaultOptions = {
            showProgress: true,
            showBullets: true,
            exitOnOverlayClick: false,
            keyboardNavigation: true,
            nextLabel: '다음',
            prevLabel: '이전',
            doneLabel: '완료',
            skipLabel: '건너뛰기',
            tooltipClass: 'Tutorial introjs-tooltip',
            highlightClass: 'Tutorial introjs-helperLayer'
        };

        const steps = customSteps || tutorialStepsMap[page] || [];

        intro.setOptions({
            steps,
            ...defaultOptions,
            ...options
        });

        intro.start();
    }, [page, customSteps, options]);

    return null;
};

export default TutorialGuide; 