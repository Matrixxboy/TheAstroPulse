
import React, { useRef, useEffect } from 'react';

const CircularSlider = ({ size = 200, min = 0, max = 360, value, onChange }) => {
    const sliderRef = useRef(null);
    const isDragging = useRef(false);

    const radius = size / 2;
    const strokeWidth = 20;
    const knobRadius = 15;
    const center = radius;
    const circleRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * circleRadius;

    const angle = ((value - min) / (max - min)) * 360;
    const progress = (value - min) / (max - min);
    const strokeDashoffset = circumference * (1 - progress);

    // Knob position calculation for 0 degrees at the top
    const knobX = center + circleRadius * Math.sin(angle * (Math.PI / 180));
    const knobY = center - circleRadius * Math.cos(angle * (Math.PI / 180));

    const handleInteraction = (e) => {
        if (!sliderRef.current) return;

        const slider = sliderRef.current.getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        const centerX = slider.left + radius;
        const centerY = slider.top + radius;
        const dx = clientX - centerX;
        const dy = clientY - centerY;

        // Calculate angle with 0 degrees at the top
        let newAngle = (Math.atan2(dy, dx) * (180 / Math.PI) + 90 + 360) % 360;
        
        const newValue = Math.round((newAngle / 360) * (max - min) + min);
        onChange(newValue);
    };

    const handleStart = (e) => {
        e.preventDefault();
        isDragging.current = true;
        handleInteraction(e);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('touchend', handleEnd);
    };

    const handleMove = (e) => {
        if (isDragging.current) {
            handleInteraction(e);
        }
    };

    const handleEnd = () => {
        isDragging.current = false;
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('touchend', handleEnd);
    };

    return (
        <svg ref={sliderRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background Circle */}
            <circle
                cx={center}
                cy={center}
                r={circleRadius}
                fill="none"
                stroke="#374151" // gray-700
                strokeWidth={strokeWidth}
            />
            {/* Progress Circle */}
            <circle
                cx={center}
                cy={center}
                r={circleRadius}
                fill="none"
                stroke="#f59e0b" // amber-500
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-270 ${center} ${center})`}
            />
            {/* Knob */}
            <g onMouseDown={handleStart} onTouchStart={handleStart}>
                <circle
                    cx={knobX}
                    cy={knobY}
                    r={knobRadius + 5}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                />
                <circle
                    cx={knobX}
                    cy={knobY}
                    r={knobRadius}
                    fill="#f59e0b" // amber-500
                    stroke="#fff"
                    strokeWidth="2"
                    style={{ cursor: 'pointer', pointerEvents: 'none' }}
                />
            </g>
            {/* Value Text */}
            <text
                x={center}
                y={center}
                textAnchor="middle"
                dy=".3em"
                fontSize="2rem"
                fontWeight="bold"
                fill="#fff"
            >
                {value}°
            </text>
        </svg>
    );
};

export default CircularSlider;
