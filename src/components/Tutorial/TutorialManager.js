import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { useEffect, useRef } from 'react';
import '../../styles/TutorialManager.scss';

// Intro.js 설정 모듈
const TutorialManager = ({ steps, startImmediately = false, onComplete, isMockPage = false }) => {
  const introInstance = useRef(null);

  useEffect(() => {
    introInstance.current = introJs();

    introInstance.current.setOptions({
      steps: steps,
      showProgress: true,
      showBullets: true,
      showStepNumbers: false,
      exitOnOverlayClick: true,
      exitOnEsc: true,
      nextLabel: '다음',
      prevLabel: '이전',
      skipLabel: '건너뛰기',
      doneLabel: '완료',
      tooltipClass: 'customTooltip',
      highlightClass: 'customHighlight',
      scrollToElement: true,
      scrollTo: 'element',
    });

    if (isMockPage) {
      introInstance.current.onchange((element) => {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      });
    }

    if (onComplete) {
      introInstance.current.oncomplete(onComplete);
    }

    if (startImmediately) {
      startTutorial();
    }

    return () => {
      if (introInstance.current) {
        introInstance.current.exit();
      }
    };
  }, [steps, startImmediately]);

  const startTutorial = () => {
    if (introInstance.current) {
      introInstance.current.start();
    }
  };

  return null;
};

export default TutorialManager;