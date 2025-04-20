import { createContext, useContext, useState } from 'react';

const TutorialContext = createContext();

export const TutorialProvider = ({ children }) => {
    const [showTutorial, setShowTutorial] = useState(false);
    const [tutorialStage, setTutorialStage] = useState('applicant');
    const [currentStep, setCurrentStep] = useState(0);

    const startTutorial = () => {
        setShowTutorial(true);
        setCurrentStep(0);
    };

    const endTutorial = () => {
        setShowTutorial(false);
        setCurrentStep(0);
    };

    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const value = {
        showTutorial,
        tutorialStage,
        currentStep,
        startTutorial,
        endTutorial,
        nextStep,
        prevStep,
        setTutorialStage
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