import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import TutorialManager from '../../context/temp/TutorialManager';
import '../../styles/TutorialButton.scss';

const TutorialButton = () => {
    const handleClick = () => {
        TutorialManager.startTutorial();
    };

    return (
        <button
            className="tutorial-button"
            onClick={handleClick}
            title="튜토리얼 시작"
        >
            <FaQuestionCircle className="tutorial-icon" />
            <span>튜토리얼</span>
        </button>
    );
};

export default TutorialButton; 