import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import '../../styles/TutorialButton.scss';
import { startTutorial } from '../../context/temp/TutorialManager';

const TutorialButton = ({ onClick }) => {
    const handleClick = () => {
        startTutorial();
        if (onClick) onClick();
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