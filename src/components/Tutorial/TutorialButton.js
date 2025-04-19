import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import '../../styles/TutorialButton.scss';

const TutorialButton = ({ onClick }) => {
    return (
        <button
            className="tutorial-button"
            onClick={onClick}
            title="튜토리얼 시작"
        >
            <FaQuestionCircle className="tutorial-icon" />
            <span>튜토리얼</span>
        </button>
    );
};

export default TutorialButton; 