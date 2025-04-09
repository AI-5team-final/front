import React from 'react';
import '../styles/SliderTransition.scss';

const SliderTransition = ({ children }) => {
    return (
        <div className="slider-transition">
            {children}
        </div>
    );
};

export default SliderTransition;