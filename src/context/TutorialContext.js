import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APPLICANT_JOURNEY } from './temp/steps/ApplicantJourney';

const TutorialContext = createContext();

export const TutorialProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isTutorialActive, setIsTutorialActive] = useState(false);
    const [currentJourney, setCurrentJourney] = useState(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const startTutorial = (journeyId) => {
        // 현재는 구직자 journey만 있으므로 하드코딩
        setCurrentJourney(APPLICANT_JOURNEY);
        setCurrentStepIndex(0);
        setIsTutorialActive(true);
    };

    const endTutorial = () => {
        setIsTutorialActive(false);
        setCurrentJourney(null);
        setCurrentStepIndex(0);
    };

    const nextStep = () => {
        if (currentJourney && currentStepIndex < currentJourney.steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    const navigateToStep = (path) => {
        if (isTutorialActive) {
            navigate(path);
        }
    };

    const getCurrentStep = () => {
        if (!currentJourney) return null;
        return currentJourney.steps[currentStepIndex];
    };

    const value = {
        isTutorialActive,
        currentJourney,
        currentStepIndex,
        startTutorial,
        endTutorial,
        nextStep,
        prevStep,
        navigateToStep,
        getCurrentStep
    };

    return (
        <TutorialContext.Provider value={value}>
            {children}
        </TutorialContext.Provider>
    );
};

export const useTutorial = () => {
    const context = useContext(TutorialContext);
    if (!context) {
        throw new Error('useTutorial must be used within a TutorialProvider');
    }
    return context;
}; 