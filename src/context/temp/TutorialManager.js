import React from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import '../../styles/TutorialManager.scss';
import { useTutorial } from '../TutorialContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { APPLICANT_JOURNEY } from './steps/ApplicantJourney';

class TutorialManager {
    static introInstance = null;
    static navigate = null;

    static init(navigate) {
        this.navigate = navigate;
    }

    static startTutorial() {
        if (!this.introInstance) {
            this.introInstance = introJs();
        }

        // 현재 페이지의 튜토리얼 단계 필터링
        const currentPageSteps = APPLICANT_JOURNEY.steps;
        
        this.introInstance.setOptions({
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
        this.introInstance
            .onbeforechange(() => {
                const currentStep = this.introInstance._currentStep;
                const steps = this.introInstance._options.steps;
                const nextPath = steps[currentStep]?.nextPath;
                
                if (nextPath && this.navigate) {
                    this.navigate(nextPath);
                    return false;
                }
                return true;
            });

        this.introInstance.start();
    }

    static endTutorial() {
        if (this.introInstance) {
            this.introInstance.exit();
        }
    }
}

// React 컴포넌트로의 래퍼
const TutorialManagerWrapper = () => {
    const introInstance = React.useRef(null);
    const location = useLocation();
    const {
        isTutorialActive,
        currentJourney,
        currentStepIndex,
        nextStep,
        prevStep,
        endTutorial,
        getCurrentStep
    } = useTutorial();
    const navigate = useNavigate();

    React.useEffect(() => {
        // 튜토리얼이 비활성화되면 intro.js 인스턴스를 정리
        if (!isTutorialActive) {
            if (introInstance.current) {
                introInstance.current.exit();
            }
            return;
        }

        // currentJourney가 없으면 튜토리얼을 시작하지 않음
        if (!currentJourney) return;

        // 현재 페이지의 튜토리얼 단계 필터링
        const currentPageSteps = currentJourney.steps.filter(
            step => step.page === location.pathname
        );

        // 현재 페이지에 해당하는 단계가 없으면 튜토리얼을 시작하지 않음
        if (currentPageSteps.length === 0) return;
        
        // intro.js 인스턴스 초기화
        introInstance.current = introJs();
        
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
                
                if (nextPath && navigate) {
                    navigate(nextPath);
                    return false;
                }
                return true;
            })
            .oncomplete(() => {
                // 마지막 단계인 경우에만 튜토리얼 종료
                const isLastStep = currentStepIndex === currentJourney.steps.length - 1;
                if (isLastStep) {
                    endTutorial();
                }
            })
            .onexit(() => {
                endTutorial();
            });

        // 튜토리얼 시작
        introInstance.current.start();

        // cleanup 함수
        return () => {
            if (introInstance.current) {
                introInstance.current.exit();
            }
        };
    }, [isTutorialActive, currentJourney, location.pathname, currentStepIndex]);

    return null;
};

TutorialManagerWrapper.startTutorial = TutorialManager.startTutorial;
TutorialManagerWrapper.endTutorial = TutorialManager.endTutorial;

export default TutorialManagerWrapper; 