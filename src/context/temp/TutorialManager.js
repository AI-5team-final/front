import { useEffect, useRef } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { useTutorial } from '../TutorialContext';
import { useLocation } from 'react-router-dom';
import { APPLICANT_JOURNEY } from './steps/ApplicantJourney';

const TutorialManager = () => {
    const introInstance = useRef(null);
    const location = useLocation();
    const {
        showTutorial,
        tutorialStage,
        currentStep,
        nextStep,
        prevStep,
        endTutorial,
        navigateToStep
    } = useTutorial();

    useEffect(() => {
        if (!showTutorial) return;

        introInstance.current = introJs();
        
        // 현재 페이지의 튜토리얼 단계 필터링
        const currentPageSteps = APPLICANT_JOURNEY.steps.filter(
            step => step.page === location.pathname
        );
        
        introInstance.current.setOptions({
            steps: currentPageSteps,
            showProgress: true,
            showBullets: true,
            showStepNumbers: false,
            exitOnOverlayClick: false,
            exitOnEsc: false,
            nextLabel: '다음',
            prevLabel: '이전',
            skipLabel: '건너뛰기',
            doneLabel: '완료',
            tooltipClass: 'customTooltip',
            highlightClass: 'customHighlight',
            scrollToElement: true,
            scrollTo: 'element',
        });

        // 이벤트 핸들러 설정
        introInstance.current
            .onbeforechange(() => {
                const currentStep = introInstance.current._currentStep;
                const steps = introInstance.current._options.steps;
                const nextPath = steps[currentStep]?.nextPath;
                
                if (nextPath) {
                    navigateToStep(nextPath);
                    return false;
                }
                return true;
            })
            .oncomplete(() => {
                // 마지막 단계인 경우에만 튜토리얼 종료
                const isLastStep = currentStep === APPLICANT_JOURNEY.steps.length - 1;
                if (isLastStep) {
                    endTutorial();
                }
            })
            .onexit(() => {
                endTutorial();
            });

        // 튜토리얼 시작
        introInstance.current.start();

        return () => {
            if (introInstance.current) {
                introInstance.current.exit();
            }
        };
    }, [showTutorial, location.pathname]);

    return null;
};

export default TutorialManager; 