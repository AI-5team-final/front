import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import '../../styles/TutorialButton.scss';
import { FaQuestionCircle } from 'react-icons/fa';

// 튜토리얼 단계 정의
const TUTORIAL_STEPS = {
  APPLICANT: {
    id: 'applicant-journey',
    title: '구직자 튜토리얼',
    description: 'Rezoom의 구직자 기능을 단계별로 알아보세요!',
    steps: [
      {
        id: 'welcome',
        page: '/',
        element: '#applicant-welcome',
        intro: '맞춤형 채용 매칭 서비스 Rezoom에 오신 것을 환영합니다!',
        position: 'bottom'
      },
      {
        id: 'upload-guide',
        page: '/',
        element: '.upload-area',
        intro: '드래그 앤 드롭이나 버튼을 눌러서 이력서를 업로드하면 맞춤형 매칭을 시작할 수 있어요!',
        position: 'left',
        nextPath: '/list'
      }
    ]
  }
};

// Context 생성
const TutorialContext = createContext(null);

// 커스텀 훅
export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

// 튜토리얼 매니저 컴포넌트
export const TutorialProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentJourney, setCurrentJourney] = useState(null);
  const [isTutorialMode, setIsTutorialMode] = useState(false);
  let introInstance = null;

  const startTutorial = (journeyType = 'APPLICANT') => {
    console.log('튜토리얼 시작:', journeyType);
    const journey = TUTORIAL_STEPS[journeyType];
    
    if (!journey) {
      console.error('존재하지 않는 튜토리얼 유형입니다.');
      return;
    }

    setCurrentJourney(journey);
    setIsTutorialActive(true);
    setIsTutorialMode(true);

    if (!introInstance) {
      introInstance = introJs();
    }

    // 현재 페이지의 단계만 필터링
    const currentPath = window.location.pathname;
    const currentPageSteps = journey.steps.filter(step => 
      step.page === currentPath && document.querySelector(step.element)
    );

    if (currentPageSteps.length === 0) {
      console.log('현재 페이지에 표시할 튜토리얼 단계가 없습니다.');
      return;
    }

    introInstance.setOptions({
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
      scrollTo: 'element'
    });

    introInstance
      .onbeforechange(() => {
        const currentStep = introInstance._currentStep;
        const steps = introInstance._options.steps;
        const nextPath = steps[currentStep]?.nextPath;
        
        if (nextPath) {
          navigate(nextPath);
          setTimeout(() => {
            introInstance.refresh();
          }, 100);
          return true;
        }
        return true;
      })
      .oncomplete(() => {
        console.log('튜토리얼 완료');
        navigate('/list');
        endTutorial();
      })
      .onexit(() => {
        console.log('튜토리얼 종료');
        endTutorial();
      });

    introInstance.start();
  };

  const endTutorial = () => {
    if (introInstance) {
      const instance = introInstance;
      introInstance = null;
      instance.exit();
    }
    setIsTutorialActive(false);
    setCurrentJourney(null);
    setIsTutorialMode(false);
  };

  return (
    <TutorialContext.Provider value={{
      isTutorialActive,
      currentJourney,
      isTutorialMode,
      startTutorial,
      endTutorial
    }}>
      {children}
    </TutorialContext.Provider>
  );
};

// 튜토리얼 버튼 컴포넌트
export const TutorialButton = () => {
  const { startTutorial } = useTutorial();

  return (
    <button
      className="tutorial-button"
      onClick={() => startTutorial('APPLICANT')}
      title="튜토리얼 시작"
    >
      <FaQuestionCircle className="tutorial-icon" />
      <span>튜토리얼</span>
    </button>
  );
}; 