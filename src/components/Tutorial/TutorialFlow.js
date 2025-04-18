import { useState } from 'react';
import ContentApplicant from '../../components/MainContent/ContentApplicant';
import ListApplicantMock from '../../mock/ListApplicantMock';
import TutorialManager from './TutorialManager';
import {
    APPLICANT_PAGE_STEPS,
    APPLICANT_LIST_STEPS,
} from './ApplicantTutorialSteps';

const TutorialFlow = () => {
    const [tutorialStage, setTutorialStage] = useState('applicant');
    const [showTutorial, setShowTutorial] = useState(false); // ✅ 핵심 상태

    const handleApplicantTutorialDone = () => {
        setShowTutorial(false);               // ✅ 튜토리얼 종료
        setTutorialStage('listApplicantMock'); // ✅ 다음 단계로 이동
    };

    return (
        <>
            {tutorialStage === 'applicant' && (
                <ContentApplicant
                    showTutorial={showTutorial}
                    onTutorialStart={() => setShowTutorial(true)}  // ✅ 여기 있어야 해
                    onTutorialDone={handleApplicantTutorialDone}
                />
            )}

            {tutorialStage === 'listApplicantMock' && (
                <>
                    <ListApplicantMock />
                    <TutorialManager
                        steps={APPLICANT_LIST_STEPS}
                        startImmediately={true}
                    />
                </>
            )}
        </>
    );
};

export default TutorialFlow;
